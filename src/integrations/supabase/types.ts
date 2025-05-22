export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_config: {
        Row: {
          agent_id: string
          agent_link: string
          api_key: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          agent_link: string
          api_key?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          agent_link?: string
          api_key?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_interactions: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          interaction_type: string
          metadata: Json | null
          model_used: string
          success_rate: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          model_used: string
          success_rate?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          model_used?: string
          success_rate?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_preferences: {
        Row: {
          created_at: string | null
          id: string
          language_preferences: Json | null
          personalization_enabled: boolean | null
          preferred_models: Json | null
          updated_at: string | null
          user_id: string | null
          voice_settings: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language_preferences?: Json | null
          personalization_enabled?: boolean | null
          preferred_models?: Json | null
          updated_at?: string | null
          user_id?: string | null
          voice_settings?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language_preferences?: Json | null
          personalization_enabled?: boolean | null
          preferred_models?: Json | null
          updated_at?: string | null
          user_id?: string | null
          voice_settings?: Json | null
        }
        Relationships: []
      }
      analytics_cleanup_logs: {
        Row: {
          details: string | null
          execution_time: string | null
          id: number
          status: string | null
        }
        Insert: {
          details?: string | null
          execution_time?: string | null
          id?: number
          status?: string | null
        }
        Update: {
          details?: string | null
          execution_time?: string | null
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          browser_info: Json | null
          created_at: string | null
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id: string
          ip_hash: string | null
          metadata: Json | null
          path: string
          performance_metrics: Json | null
          referrer: string | null
          session_id: string | null
          url: string
          user_agent: string | null
        }
        Insert: {
          browser_info?: Json | null
          created_at?: string | null
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          path: string
          performance_metrics?: Json | null
          referrer?: string | null
          session_id?: string | null
          url: string
          user_agent?: string | null
        }
        Update: {
          browser_info?: Json | null
          created_at?: string | null
          event_type?: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          path?: string
          performance_metrics?: Json | null
          referrer?: string | null
          session_id?: string | null
          url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          last_request: string
          request_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          last_request: string
          request_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          last_request?: string
          request_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_bot: boolean | null
          is_public: boolean
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_bot?: boolean | null
          is_public?: boolean
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_bot?: boolean | null
          is_public?: boolean
          message?: string
          user_id?: string | null
        }
        Relationships: []
      }
      edge_function_config: {
        Row: {
          config: Json
          created_at: string | null
          function_name: string
          updated_at: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          function_name: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          function_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_access: {
        Row: {
          feature_description: string | null
          feature_name: string
          id: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Insert: {
          feature_description?: string | null
          feature_name: string
          id?: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Update: {
          feature_description?: string | null
          feature_name?: string
          id?: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
        }
        Relationships: []
      }
      ip_rules: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          ip_address: string
          is_active: boolean | null
          rule_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          ip_address: string
          is_active?: boolean | null
          rule_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          ip_address?: string
          is_active?: boolean | null
          rule_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      note_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_address: string | null
          email_enabled: boolean | null
          id: string
          in_app_enabled: boolean | null
          minimum_severity: string | null
          notification_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_address?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          minimum_severity?: string | null
          notification_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_address?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          minimum_severity?: string | null
          notification_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          subject: string
          template_html: string
          template_text: string
          type: Database["public"]["Enums"]["notification_template_type"]
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject: string
          template_html: string
          template_text: string
          type: Database["public"]["Enums"]["notification_template_type"]
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string
          template_html?: string
          template_text?: string
          type?: Database["public"]["Enums"]["notification_template_type"]
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      password_history: {
        Row: {
          changed_at: string | null
          id: string
          password_hash: string
          user_id: string | null
        }
        Insert: {
          changed_at?: string | null
          id?: string
          password_hash: string
          user_id?: string | null
        }
        Update: {
          changed_at?: string | null
          id?: string
          password_hash?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          created_at: string
          id: number
          payment_note: string | null
          payment_proof: string | null
          plan: string
          status: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          payment_note?: string | null
          payment_proof?: string | null
          plan: string
          status?: string
          transaction_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          payment_note?: string | null
          payment_proof?: string | null
          plan?: string
          status?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          first_name: string | null
          has_completed_onboarding: boolean | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          session_timeout_minutes: number | null
          subscription_level: Database["public"]["Enums"]["subscription_tier"]
        }
        Insert: {
          first_name?: string | null
          has_completed_onboarding?: boolean | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          session_timeout_minutes?: number | null
          subscription_level?: Database["public"]["Enums"]["subscription_tier"]
        }
        Update: {
          first_name?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          session_timeout_minutes?: number | null
          subscription_level?: Database["public"]["Enums"]["subscription_tier"]
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          endpoint: string
          first_request_at: string
          id: string
          ip_address: string
          last_request_at: string
          request_count: number | null
        }
        Insert: {
          endpoint: string
          first_request_at?: string
          id?: string
          ip_address: string
          last_request_at?: string
          request_count?: number | null
        }
        Update: {
          endpoint?: string
          first_request_at?: string
          id?: string
          ip_address?: string
          last_request_at?: string
          request_count?: number | null
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          details: Json | null
          id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_questions: {
        Row: {
          answer_hash: string
          created_at: string | null
          id: string
          question: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          answer_hash: string
          created_at?: string | null
          id?: string
          question: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          answer_hash?: string
          created_at?: string | null
          id?: string
          question?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_rules: {
        Row: {
          actions: Json | null
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          rule_type: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rule_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rule_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          created_at: string | null
          device_fingerprint: string
          device_metadata: Json | null
          device_name: string | null
          id: string
          last_used_at: string | null
          trust_level: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint: string
          device_metadata?: Json | null
          device_name?: string | null
          id?: string
          last_used_at?: string | null
          trust_level: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string
          device_metadata?: Json | null
          device_name?: string | null
          id?: string
          last_used_at?: string | null
          trust_level?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_2fa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_enabled: boolean | null
          method: Database["public"]["Enums"]["two_factor_method"] | null
          secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          method?: Database["public"]["Enums"]["two_factor_method"] | null
          secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          method?: Database["public"]["Enums"]["two_factor_method"] | null
          secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          ai_summary: string | null
          category_id: string | null
          content: string
          created_at: string
          expires_at: string
          id: string
          keywords: string[] | null
          language: string | null
          sentiment: string | null
          subscription_level: Database["public"]["Enums"]["subscription_level"]
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          expires_at?: string
          id?: string
          keywords?: string[] | null
          language?: string | null
          sentiment?: string | null
          subscription_level?: Database["public"]["Enums"]["subscription_level"]
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          expires_at?: string
          id?: string
          keywords?: string[] | null
          language?: string | null
          sentiment?: string | null
          subscription_level?: Database["public"]["Enums"]["subscription_level"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "note_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          auto_summarize: boolean | null
          created_at: string | null
          id: string
          preferred_language: string | null
          transcription_model: string | null
          updated_at: string | null
          user_id: string | null
          voice_effect: string | null
        }
        Insert: {
          auto_summarize?: boolean | null
          created_at?: string | null
          id?: string
          preferred_language?: string | null
          transcription_model?: string | null
          updated_at?: string | null
          user_id?: string | null
          voice_effect?: string | null
        }
        Update: {
          auto_summarize?: boolean | null
          created_at?: string | null
          id?: string
          preferred_language?: string | null
          transcription_model?: string | null
          updated_at?: string | null
          user_id?: string | null
          voice_effect?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          geolocation: Json | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_active: string
          risk_score: number | null
          session_metadata: Json | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          geolocation?: Json | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active?: string
          risk_score?: number | null
          session_metadata?: Json | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          geolocation?: Json | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active?: string
          risk_score?: number | null
          session_metadata?: Json | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_sessions_view: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          geolocation: Json | null
          id: string | null
          ip_address: string | null
          is_active: boolean | null
          is_within_timeout: boolean | null
          last_active: string | null
          risk_score: number | null
          session_metadata: Json | null
          session_timeout_minutes: number | null
          session_token: string | null
          user_agent: string | null
          user_id: string | null
        }
        Relationships: []
      }
      session_analytics: {
        Row: {
          active_sessions: number | null
          avg_risk_score: number | null
          devices: Json | null
          last_session_start: string | null
          locations: Json | null
          total_sessions: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_session_risk_score: {
        Args: {
          p_user_id: string
          p_ip_address: string
          p_device_fingerprint: string
          p_geolocation: Json
        }
        Returns: number
      }
      check_rate_limit: {
        Args:
          | {
              p_ip_address: string
              p_endpoint: string
              p_max_requests?: number
              p_window_seconds?: number
            }
          | {
              p_user_id: string
              p_endpoint: string
              p_max_requests: number
              p_window_seconds: number
            }
        Returns: boolean
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_analytics_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      init_edge_function_config: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: { p_event_type: string; p_details?: Json }
        Returns: undefined
      }
      revoke_session: {
        Args: { session_id: string }
        Returns: undefined
      }
      validate_password: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      analytics_event_type: "page_view" | "performance" | "error" | "custom"
      app_role: "admin" | "user"
      notification_template_type:
        | "security_alert"
        | "login_attempt"
        | "password_change"
        | "device_verification"
      subscription_level: "free" | "pro" | "premium"
      subscription_tier: "free" | "pro" | "premium"
      two_factor_method: "authenticator" | "sms" | "email"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      analytics_event_type: ["page_view", "performance", "error", "custom"],
      app_role: ["admin", "user"],
      notification_template_type: [
        "security_alert",
        "login_attempt",
        "password_change",
        "device_verification",
      ],
      subscription_level: ["free", "pro", "premium"],
      subscription_tier: ["free", "pro", "premium"],
      two_factor_method: ["authenticator", "sms", "email"],
    },
  },
} as const
