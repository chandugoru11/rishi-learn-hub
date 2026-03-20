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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assignment_submissions: {
        Row: {
          assignment_id: string
          feedback: string | null
          file_url: string | null
          grade: string | null
          graded_at: string | null
          id: string
          student_id: string
          submitted_at: string
        }
        Insert: {
          assignment_id: string
          feedback?: string | null
          file_url?: string | null
          grade?: string | null
          graded_at?: string | null
          id?: string
          student_id: string
          submitted_at?: string
        }
        Update: {
          assignment_id?: string
          feedback?: string | null
          file_url?: string | null
          grade?: string | null
          graded_at?: string | null
          id?: string
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          course_id: string
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          file_url: string | null
          id: string
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          check_in: string | null
          check_out: string | null
          id: string
          session_id: string
          status: string | null
          student_id: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          id?: string
          session_id: string
          status?: string | null
          student_id: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          id?: string
          session_id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          course_id: string
          created_at: string
          created_by: string
          id: string
          session_date: string
          session_title: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by: string
          id?: string
          session_date: string
          session_title?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string
          id?: string
          session_date?: string
          session_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          added_at: string
          course_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          course_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string
          course_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          id: string
          issued_at: string
          pdf_url: string | null
          qr_code_url: string | null
          student_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          id?: string
          issued_at?: string
          pdf_url?: string | null
          qr_code_url?: string | null
          student_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          id?: string
          issued_at?: string
          pdf_url?: string | null
          qr_code_url?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_free_preview: boolean | null
          module_id: string
          sort_order: number | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean | null
          module_id: string
          sort_order?: number | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean | null
          module_id?: string
          sort_order?: number | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number | null
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          discount_price: number | null
          duration_hours: number | null
          id: string
          instructor_id: string
          is_published: boolean | null
          is_recorded: boolean | null
          max_students: number | null
          price: number
          short_description: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          validity_days: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          duration_hours?: number | null
          id?: string
          instructor_id: string
          is_published?: boolean | null
          is_recorded?: boolean | null
          max_students?: number | null
          price?: number
          short_description?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          validity_days?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string
          is_published?: boolean | null
          is_recorded?: boolean | null
          max_students?: number | null
          price?: number
          short_description?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          validity_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          assigned_to: string | null
          course_interest: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          course_interest?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          course_interest?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      crm_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          lead_id: string
          note: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          lead_id: string
          note: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          lead_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          expires_at: string | null
          id: string
          progress_percent: number | null
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          progress_percent?: number | null
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          progress_percent?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_answers: {
        Row: {
          answer_text: string | null
          id: string
          is_correct: boolean | null
          marks_awarded: number | null
          question_id: string
          submission_id: string
        }
        Insert: {
          answer_text?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id: string
          submission_id: string
        }
        Update: {
          answer_text?: string | null
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "exam_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_questions: {
        Row: {
          correct_answer: string | null
          created_at: string
          exam_id: string
          id: string
          marks: number
          options: Json | null
          question_text: string
          question_type: string
          sort_order: number | null
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          exam_id: string
          id?: string
          marks?: number
          options?: Json | null
          question_text: string
          question_type: string
          sort_order?: number | null
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          exam_id?: string
          id?: string
          marks?: number
          options?: Json | null
          question_text?: string
          question_type?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_submissions: {
        Row: {
          exam_id: string
          id: string
          is_graded: boolean | null
          is_passed: boolean | null
          started_at: string
          student_id: string
          submitted_at: string | null
          total_score: number | null
        }
        Insert: {
          exam_id: string
          id?: string
          is_graded?: boolean | null
          is_passed?: boolean | null
          started_at?: string
          student_id: string
          submitted_at?: string | null
          total_score?: number | null
        }
        Update: {
          exam_id?: string
          id?: string
          is_graded?: boolean | null
          is_passed?: boolean | null
          started_at?: string
          student_id?: string
          submitted_at?: string | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_submissions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          course_id: string
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number
          end_time: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          id: string
          is_published: boolean | null
          pass_marks: number
          start_time: string | null
          title: string
          total_marks: number
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number
          end_time?: string | null
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          is_published?: boolean | null
          pass_marks?: number
          start_time?: string | null
          title: string
          total_marks?: number
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number
          end_time?: string | null
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          is_published?: boolean | null
          pass_marks?: number
          start_time?: string | null
          title?: string
          total_marks?: number
        }
        Relationships: [
          {
            foreignKeyName: "exams_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          course_id: string
          created_at: string
          id: string
          order_id: string
          price: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          order_id: string
          price: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          order_id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          invoice_number: string | null
          payment_id: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_number?: string | null
          payment_id?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_number?: string | null
          payment_id?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          last_position_seconds: number | null
          lesson_id: string
          student_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          last_position_seconds?: number | null
          lesson_id: string
          student_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          last_position_seconds?: number | null
          lesson_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_campaigns: {
        Row: {
          created_at: string
          created_by: string
          delivered_count: number | null
          id: string
          message_text: string
          read_count: number | null
          scheduled_at: string | null
          sent_count: number | null
          status: string | null
          target_audience: string | null
          template_name: string | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          delivered_count?: number | null
          id?: string
          message_text: string
          read_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          status?: string | null
          target_audience?: string | null
          template_name?: string | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          delivered_count?: number | null
          id?: string
          message_text?: string
          read_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          status?: string | null
          target_audience?: string | null
          template_name?: string | null
          title?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          contact_name: string | null
          contact_phone: string
          created_at: string
          direction: string
          id: string
          linked_lead_id: string | null
          message_text: string
          status: string | null
        }
        Insert: {
          contact_name?: string | null
          contact_phone: string
          created_at?: string
          direction: string
          id?: string
          linked_lead_id?: string | null
          message_text: string
          status?: string | null
        }
        Update: {
          contact_name?: string | null
          contact_phone?: string
          created_at?: string
          direction?: string
          id?: string
          linked_lead_id?: string | null
          message_text?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_linked_lead_id_fkey"
            columns: ["linked_lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "student"
      exam_type: "mcq" | "descriptive" | "mixed"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "lost"
      order_status: "pending" | "paid" | "failed" | "refunded"
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
    Enums: {
      app_role: ["admin", "instructor", "student"],
      exam_type: ["mcq", "descriptive", "mixed"],
      lead_status: ["new", "contacted", "qualified", "converted", "lost"],
      order_status: ["pending", "paid", "failed", "refunded"],
    },
  },
} as const
