export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          details: Json | null;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          ip_address: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          details?: Json | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          ip_address?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          details?: Json | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          ip_address?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          assigned_to: string | null;
          created_at: string;
          id: string;
          lead_id: string;
          notes: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assigned_to?: string | null;
          created_at?: string;
          id?: string;
          lead_id: string;
          notes?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assigned_to?: string | null;
          created_at?: string;
          id?: string;
          lead_id?: string;
          notes?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      market_data_cache: {
        Row: {
          ask: number | null;
          bid: number | null;
          change: number | null;
          change_percent: number | null;
          high: number | null;
          id: string;
          low: number | null;
          open: number | null;
          price: number;
          symbol: string;
          updated_at: string;
          volume: number | null;
        };
        Insert: {
          ask?: number | null;
          bid?: number | null;
          change?: number | null;
          change_percent?: number | null;
          high?: number | null;
          id?: string;
          low?: number | null;
          open?: number | null;
          price: number;
          symbol: string;
          updated_at?: string;
          volume?: number | null;
        };
        Update: {
          ask?: number | null;
          bid?: number | null;
          change?: number | null;
          change_percent?: number | null;
          high?: number | null;
          id?: string;
          low?: number | null;
          open?: number | null;
          price?: number;
          symbol?: string;
          updated_at?: string;
          volume?: number | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          average_fill_price: number | null;
          commission: number | null;
          created_at: string;
          filled_at: string | null;
          filled_quantity: number | null;
          id: string;
          notes: string | null;
          order_type: string;
          price: number | null;
          quantity: number;
          side: string;
          status: string;
          stop_price: number | null;
          symbol: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          average_fill_price?: number | null;
          commission?: number | null;
          created_at?: string;
          filled_at?: string | null;
          filled_quantity?: number | null;
          id?: string;
          notes?: string | null;
          order_type: string;
          price?: number | null;
          quantity: number;
          side: string;
          status?: string;
          stop_price?: number | null;
          symbol: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          average_fill_price?: number | null;
          commission?: number | null;
          created_at?: string;
          filled_at?: string | null;
          filled_quantity?: number | null;
          id?: string;
          notes?: string | null;
          order_type?: string;
          price?: number | null;
          quantity?: number;
          side?: string;
          status?: string;
          stop_price?: number | null;
          symbol?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      positions: {
        Row: {
          current_price: number;
          entry_price: number;
          id: string;
          opened_at: string;
          quantity: number;
          realized_pnl: number | null;
          side: string;
          stop_loss: number | null;
          symbol: string;
          take_profit: number | null;
          unrealized_pnl: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          current_price: number;
          entry_price: number;
          id?: string;
          opened_at?: string;
          quantity: number;
          realized_pnl?: number | null;
          side: string;
          stop_loss?: number | null;
          symbol: string;
          take_profit?: number | null;
          unrealized_pnl?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          current_price?: number;
          entry_price?: number;
          id?: string;
          opened_at?: string;
          quantity?: number;
          realized_pnl?: number | null;
          side?: string;
          stop_loss?: number | null;
          symbol?: string;
          take_profit?: number | null;
          unrealized_pnl?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'positions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          account_status: Database['public']['Enums']['account_status'];
          balance: number;
          bonus_balance: number;
          country: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string;
          equity: number;
          free_margin: number;
          full_name: string | null;
          id: string;
          kyc_status: Database['public']['Enums']['kyc_status'];
          margin_used: number;
          phone: string | null;
          risk_tolerance: string | null;
          trading_experience: string | null;
          updated_at: string;
        };
        Insert: {
          account_status?: Database['public']['Enums']['account_status'];
          balance?: number;
          bonus_balance?: number;
          country?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email: string;
          equity?: number;
          free_margin?: number;
          full_name?: string | null;
          id: string;
          kyc_status?: Database['public']['Enums']['kyc_status'];
          margin_used?: number;
          phone?: string | null;
          risk_tolerance?: string | null;
          trading_experience?: string | null;
          updated_at?: string;
        };
        Update: {
          account_status?: Database['public']['Enums']['account_status'];
          balance?: number;
          bonus_balance?: number;
          country?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string;
          equity?: number;
          free_margin?: number;
          full_name?: string | null;
          id?: string;
          kyc_status?: Database['public']['Enums']['kyc_status'];
          margin_used?: number;
          phone?: string | null;
          risk_tolerance?: string | null;
          trading_experience?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      trade_history: {
        Row: {
          commission: number | null;
          executed_at: string;
          id: string;
          order_id: string | null;
          pnl: number | null;
          price: number;
          quantity: number;
          side: string;
          symbol: string;
          user_id: string;
        };
        Insert: {
          commission?: number | null;
          executed_at?: string;
          id?: string;
          order_id?: string | null;
          pnl?: number | null;
          price: number;
          quantity: number;
          side: string;
          symbol: string;
          user_id: string;
        };
        Update: {
          commission?: number | null;
          executed_at?: string;
          id?: string;
          order_id?: string | null;
          pnl?: number | null;
          price?: number;
          quantity?: number;
          side?: string;
          symbol?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trade_history_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trade_history_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_lead_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      has_role: {
        Args: {
          _role: Database['public']['Enums']['app_role'];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      account_status: 'pending' | 'active' | 'suspended' | 'closed';
      app_role: 'admin' | 'user';
      kyc_status: 'not_started' | 'pending' | 'approved' | 'rejected';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      account_status: ['pending', 'active', 'suspended', 'closed'],
      app_role: ['admin', 'user'],
      kyc_status: ['not_started', 'pending', 'approved', 'rejected'],
    },
  },
} as const;
