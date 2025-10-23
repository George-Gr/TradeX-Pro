-- =======================================================================================
-- MARGIN CALL TRIGGERS AND AUTOMATIC RISK MANAGEMENT
-- Version: 20251010220001
-- Purpose: Automated margin call and liquidation triggers
-- =======================================================================================
-- This migration adds database triggers for automatic margin monitoring
-- and liquidation to protect against over-leveraged positions
-- =======================================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS plpgsql;

-- =======================================================================================
-- FUNCTIONS FOR AUTOMATIC MARGIN MANAGEMENT
-- =======================================================================================

-- Function to calculate current equity and margin levels
CREATE OR REPLACE FUNCTION calculate_margin_levels(user_id UUID)
RETURNS TABLE (
  total_balance DECIMAL(15, 2),
  total_bonus_balance DECIMAL(15, 2),
  total_equity DECIMAL(15, 2),
  margin_used DECIMAL(15, 2),
  free_margin DECIMAL(15, 2),
  margin_level DECIMAL(15, 2),
  margin_call_threshold DECIMAL(15, 2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_positions AS (
    SELECT
      up.balance,
      up.bonus_balance,
      up.equity,
      up.margin_used,
      COALESCE(SUM(p.unrealized_pnl), 0) as total_unrealized_pnl
    FROM profiles up
    LEFT JOIN positions p ON p.user_id = up.id AND p.closed_at IS NULL
    WHERE up.id = user_id
    GROUP BY up.id, up.balance, up.bonus_balance, up.equity, up.margin_used
  )
  SELECT
    up.balance,
    up.bonus_balance,
    up.equity + up.total_unrealized_pnl as total_equity,
    up.margin_used,
    GREATEST(0, up.equity + up.total_unrealized_pnl - up.margin_used) as free_margin,
    CASE
      WHEN up.margin_used > 0 THEN
        ((up.equity + up.total_unrealized_pnl) / up.margin_used) * 100
      ELSE 100.0
    END as margin_level,
    20.0 as margin_call_threshold -- 20% margin call threshold
  FROM user_positions up;
END;
$$;

-- Function to execute margin call (suspend account)
CREATE OR REPLACE FUNCTION execute_margin_call(user_id UUID, current_margin_level DECIMAL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user account status to suspended
  UPDATE profiles
  SET
    account_status = 'suspended',
    updated_at = NOW()
  WHERE id = user_id;

  -- Log the margin call event
  INSERT INTO audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    user_id,
    'margin_call_triggered',
    'profile',
    user_id,
    jsonb_build_object(
      'margin_level', current_margin_level,
      'account_suspended', true,
      'timestamp', NOW(),
      'automated', true
    )
  );

  -- Close all open positions for the user (force liquidation)
  UPDATE positions
  SET
    closed_at = NOW(),
    updated_at = NOW(),
    notes = CONCAT('Auto-liquidated due to margin call at ', current_margin_level::text, '% margin level')
  WHERE user_id = user_id AND closed_at IS NULL;

  -- Update user balance to reflect liquidated positions (this would typically involve market orders)
  -- For now, we mark positions as closed and calculate final P&L when liquidation occurs
  -- In production, this would trigger actual market sell orders
END;
$$;

-- Function to check and execute margin calls
CREATE OR REPLACE FUNCTION check_margin_call(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  margin_data RECORD;
  should_trigger BOOLEAN := FALSE;
BEGIN
  -- Get current margin levels
  SELECT * INTO margin_data
  FROM calculate_margin_levels(user_id);

  -- Check if margin call should be triggered
  IF margin_data.margin_level <= margin_data.margin_call_threshold THEN
    -- Execute margin call
    PERFORM execute_margin_call(user_id, margin_data.margin_level);
    should_trigger := TRUE;
  END IF;

  RETURN should_trigger;
END;
$$;

-- =======================================================================================
-- TRIGGERS FOR AUTOMATIC MARGIN MONITORING
-- =======================================================================================

-- Trigger function to check margin after position updates
CREATE OR REPLACE FUNCTION trigger_margin_check()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check margin after any position update (P&L changes)
  IF OLD.unrealized_pnl IS DISTINCT FROM NEW.unrealized_pnl THEN
    PERFORM check_margin_call(NEW.user_id);
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger function to check margin after profile updates
CREATE OR REPLACE FUNCTION trigger_margin_check_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check margin after balance or margin updates
  IF OLD.balance IS DISTINCT FROM NEW.balance OR
     OLD.margin_used IS DISTINCT FROM NEW.margin_used OR
     OLD.equity IS DISTINCT FROM NEW.equity THEN
    PERFORM check_margin_call(NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER margin_check_on_position_update
  AFTER UPDATE ON positions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_margin_check();

CREATE TRIGGER margin_check_on_profile_update
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_margin_check_profile();

-- =======================================================================================
-- MARGIN WARNING SYSTEM
-- =======================================================================================

-- Function to send margin warnings (logs for now, would integrate with notification system)
CREATE OR REPLACE FUNCTION log_margin_warning(user_id UUID, margin_level DECIMAL, warning_type TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    user_id,
    'margin_warning',
    'profile',
    user_id,
    jsonb_build_object(
      'margin_level', margin_level,
      'warning_type', warning_type,
      'requires_action', warning_type = 'critical',
      'timestamp', NOW()
    )
  );
END;
$$;

-- Function to check and issue margin warnings
CREATE OR REPLACE FUNCTION check_margin_warnings(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  margin_data RECORD;
BEGIN
  -- Get current margin levels
  SELECT * INTO margin_data
  FROM calculate_margin_levels(user_id);

  -- Issue warnings based on margin level
  IF margin_data.margin_level <= 50.0 AND margin_data.margin_level > margin_data.margin_call_threshold THEN
    -- Low margin warning
    PERFORM log_margin_warning(user_id, margin_data.margin_level, 'low');
  ELSIF margin_data.margin_level <= 30.0 AND margin_data.margin_level > margin_data.margin_call_threshold THEN
    -- Critical margin warning
    PERFORM log_margin_warning(user_id, margin_data.margin_level, 'critical');
  ELSIF margin_data.margin_level <= margin_data.margin_call_threshold THEN
    -- Margin call triggered (already handled by execute_margin_call)
    NULL;
  END IF;
END;
$$;

-- =======================================================================================
-- MIGRATION LOG
-- =======================================================================================

INSERT INTO audit_logs (action, entity_type, details)
VALUES (
  'system_migration',
  'database',
  '{"migration": "20251010220001_margin_call_triggers", "description": "Added automatic margin call and liquidation triggers", "timestamp": "' || NOW()::text || '"}'
);

-- =======================================================================================
-- END OF MARGIN MANAGEMENT MIGRATION
-- =======================================================================================
