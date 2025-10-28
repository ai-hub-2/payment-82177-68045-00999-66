// Manual types until auto-generated types are updated
export interface Database {
  public: {
    Tables: {
      chalets: {
        Row: {
          id: string;
          name: string;
          country_code: string;
          city: string;
          address: string;
          default_price: number;
          images: string[];
          provider_id: string | null;
          verified: boolean;
          amenities: string[];
          capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country_code: string;
          city: string;
          address: string;
          default_price: number;
          images?: string[];
          provider_id?: string | null;
          verified?: boolean;
          amenities?: string[];
          capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country_code?: string;
          city?: string;
          address?: string;
          default_price?: number;
          images?: string[];
          provider_id?: string | null;
          verified?: boolean;
          amenities?: string[];
          capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      shipping_carriers: {
        Row: {
          id: string;
          name: string;
          country_code: string;
          services: string[];
          contact: string | null;
          website: string | null;
          logo_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country_code: string;
          services: string[];
          contact?: string | null;
          website?: string | null;
          logo_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country_code?: string;
          services?: string[];
          contact?: string | null;
          website?: string | null;
          logo_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      links: {
        Row: {
          id: string;
          type: string;
          country_code: string;
          provider_id: string | null;
          payload: any;
          microsite_url: string;
          payment_url: string;
          signature: string;
          status: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          type: string;
          country_code: string;
          provider_id?: string | null;
          payload: any;
          microsite_url: string;
          payment_url: string;
          signature: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          type?: string;
          country_code?: string;
          provider_id?: string | null;
          payload?: any;
          microsite_url?: string;
          payment_url?: string;
          signature?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          link_id: string | null;
          amount: number;
          currency: string;
          status: string;
          otp: string | null;
          attempts: number;
          locked_until: string | null;
          receipt_url: string | null;
          cardholder_name: string | null;
          last_four: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          link_id?: string | null;
          amount: number;
          currency: string;
          status?: string;
          otp?: string | null;
          attempts?: number;
          locked_until?: string | null;
          receipt_url?: string | null;
          cardholder_name?: string | null;
          last_four?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          link_id?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          otp?: string | null;
          attempts?: number;
          locked_until?: string | null;
          receipt_url?: string | null;
          cardholder_name?: string | null;
          last_four?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
