import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface OrderValidationData {
  symbol: string;
  orderType: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface PositionValidationData {
  positionId: string;
  closeQuantity?: number;
}

class ValidationService {
  /**
   * Validates order parameters before submission
   */
  async validateOrder(orderData: OrderValidationData, userId: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Basic field validation
    if (!orderData.symbol || typeof orderData.symbol !== 'string') {
      result.errors.push('Symbol is required');
      result.isValid = false;
    }

    if (!['market', 'limit', 'stop', 'stop_limit'].includes(orderData.orderType)) {
      result.errors.push('Invalid order type');
      result.isValid = false;
    }

    if (!['buy', 'sell'].includes(orderData.side)) {
      result.errors.push('Invalid side');
      result.isValid = false;
    }

    if (!orderData.quantity || orderData.quantity <= 0) {
      result.errors.push('Quantity must be positive');
      result.isValid = false;
    }

    if (orderData.quantity > 1000000) {
      result.errors.push('Quantity exceeds maximum allowed (1,000,000)');
      result.isValid = false;
    }

    // Price validations
    if (orderData.orderType === 'limit') {
      if (!orderData.price || orderData.price <= 0) {
        result.errors.push('Limit price is required and must be positive');
        result.isValid = false;
      }

      // Get current market price for validation
      const { data: marketData } = await supabase
        .from('market_data_cache')
        .select('price')
        .eq('symbol', orderData.symbol)
        .single();

      if (orderData.price && marketData?.price) {
        const deviation = Math.abs((orderData.price - marketData.price) / marketData.price) * 100;
        if (deviation > 50) {
          result.warnings.push(
            `Limit price deviates ${deviation.toFixed(1)}% from current market price`
          );
        }
      }
    }

    // Stop loss and take profit validations
    if (orderData.stopLoss && orderData.stopLoss <= 0) {
      result.errors.push('Stop loss must be positive');
      result.isValid = false;
    }

    if (orderData.takeProfit && orderData.takeProfit <= 0) {
      result.errors.push('Take profit must be positive');
      result.isValid = false;
    }

    // Cross-validation between prices
    if (orderData.stopLoss && orderData.takeProfit) {
      if (orderData.side === 'buy') {
        if (orderData.stopLoss >= orderData.takeProfit) {
          result.errors.push('Stop loss must be below take profit for buy orders');
          result.isValid = false;
        }
      } else {
        if (orderData.stopLoss <= orderData.takeProfit) {
          result.errors.push('Stop loss must be above take profit for sell orders');
          result.isValid = false;
        }
      }
    }

    // Min quantity check
    if (orderData.quantity < 0.01) {
      result.errors.push('Minimum quantity is 0.01 lots');
      result.isValid = false;
    }

    // User account validation
    if (result.isValid) {
      const accountValidation = await this.validateUserAccount(userId, orderData);
      result.errors.push(...accountValidation.errors);
      result.warnings.push(...accountValidation.warnings);
      if (!accountValidation.isValid) {
        result.isValid = false;
      }
    }

    return result;
  }

  /**
   * Validates position closing parameters
   */
  async validatePositionClose(
    closeData: PositionValidationData,
    userId: string
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Get position details
    const { data: position, error } = await supabase
      .from('positions')
      .select('*')
      .eq('id', closeData.positionId)
      .eq('user_id', userId)
      .is('closed_at', null)
      .single();

    if (error || !position) {
      result.errors.push('Position not found or access denied');
      result.isValid = false;
      return result;
    }

    // Validate close quantity
    const closeQuantity = closeData.closeQuantity || position.quantity;

    if (closeQuantity <= 0) {
      result.errors.push('Close quantity must be positive');
      result.isValid = false;
    }

    if (closeQuantity > position.quantity) {
      result.errors.push('Close quantity cannot exceed position quantity');
      result.isValid = false;
    }

    // Partial close minimum
    if (closeQuantity < position.quantity && closeQuantity < 0.01) {
      result.errors.push('Minimum partial close quantity is 0.01 lots');
      result.isValid = false;
    }

    // Warn about large unrealized losses
    if (position.unrealized_pnl && position.unrealized_pnl < -100) {
      result.warnings.push(
        `Closing position will realize a loss of $${Math.abs(position.unrealized_pnl).toFixed(2)}`
      );
    }

    return result;
  }

  /**
   * Validates user account eligibility for trading
   */
  private async validateUserAccount(
    userId: string,
    orderData: OrderValidationData
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Get user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      result.errors.push('User profile not found');
      result.isValid = false;
      return result;
    }

    // Account status check
    if (profile.account_status !== 'active') {
      result.errors.push(`Account is ${profile.account_status}. Trading is not allowed.`);
      result.isValid = false;
    }

    // KYC verification check
    const { data: kycStatus } = await supabase
      .from('kyc_status')
      .select('is_verified')
      .eq('user_id', userId)
      .single();

    if (!kycStatus?.is_verified) {
      result.warnings.push('KYC verification pending. Full access requires KYC approval.');
    }

    // Calculate estimated margin requirement
    const { data: marketData } = await supabase
      .from('market_data_cache')
      .select('price')
      .eq('symbol', orderData.symbol)
      .single();

    if (marketData?.price) {
      const notionalValue = marketData.price * orderData.quantity;
      const marginRequired = notionalValue * 0.1; // 10% margin

      // Check existing positions for this symbol to prevent duplicates
      const { data: existingPositions } = await supabase
        .from('positions')
        .select('id, side, quantity')
        .eq('user_id', userId)
        .eq('symbol', orderData.symbol)
        .eq('side', orderData.side)
        .is('closed_at', null);

      if ((existingPositions?.length || 0) > 0) {
        result.errors.push(
          `You already have an open ${orderData.side} position for ${orderData.symbol}`
        );
        result.isValid = false;
      }

      // Check available margin (current balance - used margin)
      const availableMargin = profile.free_margin;
      if (availableMargin < marginRequired) {
        const shortfall = marginRequired - availableMargin;
        result.errors.push(
          `Insufficient margin. Need additional $${shortfall.toFixed(2)}. Available: $${availableMargin.toFixed(2)}`
        );
        result.isValid = false;
      }

      // Warning for high leverage
      const equityAfterOrder = profile.equity - marginRequired;
      const marginLevelAfter = equityAfterOrder > 0 ? (equityAfterOrder / marginRequired) * 100 : 0;
      if (marginLevelAfter < 50) {
        result.warnings.push(
          `High leverage warning: Margin level will be ${marginLevelAfter.toFixed(1)}% after this order`
        );
      }
    }

    return result;
  }

  /**
   * Validates symbol availability
   */
  async isValidSymbol(symbol: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('market_data_cache')
        .select('symbol')
        .eq('symbol', symbol)
        .single();

      return !!data;
    } catch {
      return false;
    }
  }

  /**
   * Gets available symbols for trading
   */
  async getAvailableSymbols(): Promise<string[]> {
    try {
      const { data } = await supabase
        .from('market_data_cache')
        .select('symbol')
        .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

      return data?.map((item) => item.symbol) || [];
    } catch (error) {
      console.error('Failed to get available symbols:', error);
      return [];
    }
  }

  /**
   * Validates market data availability
   */
  async validateMarketData(symbol: string): Promise<{ available: boolean; stale: boolean }> {
    try {
      const { data, error } = await supabase
        .from('market_data_cache')
        .select('updated_at, price')
        .eq('symbol', symbol)
        .single();

      if (error || !data) {
        return { available: false, stale: true };
      }

      const age = Date.now() - new Date(data.updated_at).getTime();
      const isStale = age > 5 * 60 * 1000; // 5 minutes

      return {
        available: data.price > 0,
        stale: isStale,
      };
    } catch {
      return { available: false, stale: true };
    }
  }
}

// Export singleton instance
export const validationService = new ValidationService();
