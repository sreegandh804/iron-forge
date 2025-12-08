export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      custom_exercises: {
        Row: {
          created_at: string | null
          description: string | null
          equipment_id: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          equipment_id: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          equipment_id?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_exercises_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_program_workouts: {
        Row: {
          created_at: string | null
          day_label: string | null
          description: string | null
          exercises: Json
          id: string
          program_id: string
          sort_order: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          day_label?: string | null
          description?: string | null
          exercises?: Json
          id?: string
          program_id: string
          sort_order?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          day_label?: string | null
          description?: string | null
          exercises?: Json
          id?: string
          program_id?: string
          sort_order?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_program_workouts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "custom_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_programs: {
        Row: {
          created_at: string | null
          days_per_week: number | null
          description: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          days_per_week?: number | null
          description?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          days_per_week?: number | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_available: boolean | null
          is_default: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          is_default?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          is_default?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      exercise_muscle_targets: {
        Row: {
          exercise_id: string
          id: string
          muscle_group_id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          exercise_id: string
          id?: string
          muscle_group_id: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          exercise_id?: string
          id?: string
          muscle_group_id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_muscle_targets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "custom_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_muscle_targets_muscle_group_id_fkey"
            columns: ["muscle_group_id"]
            isOneToOne: false
            referencedRelation: "muscle_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_set_muscles: {
        Row: {
          created_at: string
          exercise_set_id: string
          id: string
          muscle_group: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          exercise_set_id: string
          id?: string
          muscle_group: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          exercise_set_id?: string
          id?: string
          muscle_group?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_set_muscles_exercise_set_id_fkey"
            columns: ["exercise_set_id"]
            isOneToOne: false
            referencedRelation: "exercise_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sets: {
        Row: {
          created_at: string
          exercise_name: string
          id: string
          muscle_group: string
          reps: number
          set_number: number
          user_id: string | null
          weight: number
          workout_log_id: string
        }
        Insert: {
          created_at?: string
          exercise_name: string
          id?: string
          muscle_group: string
          reps?: number
          set_number?: number
          user_id?: string | null
          weight?: number
          workout_log_id: string
        }
        Update: {
          created_at?: string
          exercise_name?: string
          id?: string
          muscle_group?: string
          reps?: number
          set_number?: number
          user_id?: string | null
          weight?: number
          workout_log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sets_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      muscle_groups: {
        Row: {
          body_region: string
          id: string
          name: string
          recovery_hours: number | null
        }
        Insert: {
          body_region: string
          id?: string
          name: string
          recovery_hours?: number | null
        }
        Update: {
          body_region?: string
          id?: string
          name?: string
          recovery_hours?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      user_workout_templates: {
        Row: {
          base_template_id: string | null
          created_at: string | null
          day_label: string | null
          description: string | null
          exercises: Json
          id: string
          program_type: string
          sort_order: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          base_template_id?: string | null
          created_at?: string | null
          day_label?: string | null
          description?: string | null
          exercises?: Json
          id?: string
          program_type: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          base_template_id?: string | null
          created_at?: string | null
          day_label?: string | null
          description?: string | null
          exercises?: Json
          id?: string
          program_type?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_workout_templates_base_template_id_fkey"
            columns: ["base_template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          program_type: string
          status: string | null
          user_id: string | null
          workout_description: string | null
          workout_title: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          program_type: string
          status?: string | null
          user_id?: string | null
          workout_description?: string | null
          workout_title: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          program_type?: string
          status?: string | null
          user_id?: string | null
          workout_description?: string | null
          workout_title?: string
        }
        Relationships: []
      }
      workout_template_exercises: {
        Row: {
          created_at: string | null
          equipment_name: string | null
          exercise_name: string
          id: string
          muscle_group: string
          muscle_targets: Json | null
          sort_order: number | null
          template_id: string
        }
        Insert: {
          created_at?: string | null
          equipment_name?: string | null
          exercise_name: string
          id?: string
          muscle_group: string
          muscle_targets?: Json | null
          sort_order?: number | null
          template_id: string
        }
        Update: {
          created_at?: string | null
          equipment_name?: string | null
          exercise_name?: string
          id?: string
          muscle_group?: string
          muscle_targets?: Json | null
          sort_order?: number | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_template_exercises_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          created_at: string | null
          day_label: string | null
          description: string | null
          id: string
          is_system: boolean | null
          program_type: string
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          day_label?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          program_type: string
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          day_label?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          program_type?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_muscle_last_worked: {
        Args: never
        Returns: {
          last_worked: string
          muscle_group: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
