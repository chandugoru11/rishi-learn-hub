
-- =============================================
-- RISHI KNOWLEDGE HUB - FULL DATABASE SCHEMA
-- Phases 1, 2, and 3
-- =============================================

-- === ENUMS ===
CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE public.exam_type AS ENUM ('mcq', 'descriptive', 'mixed');

-- === TIMESTAMP TRIGGER FUNCTION ===
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- === PROFILES ===
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- === USER ROLES ===
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- === SECURITY DEFINER FUNCTION FOR ROLE CHECK ===
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- === AUTO-CREATE PROFILE ON SIGNUP ===
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- === CATEGORIES ===
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- === COURSES ===
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id),
  instructor_id UUID REFERENCES auth.users(id) NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(10,2),
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_recorded BOOLEAN DEFAULT false,
  duration_hours INTEGER DEFAULT 0,
  max_students INTEGER,
  validity_days INTEGER DEFAULT 365,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- === COURSE MODULES ===
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- === COURSE LESSONS ===
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- === ENROLLMENTS ===
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  progress_percent NUMERIC(5,2) DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- === STUDENT PROGRESS ===
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  last_position_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- === CART ITEMS ===
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- === ORDERS ===
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  payment_method TEXT,
  invoice_number TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- === ORDER ITEMS ===
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- === ASSIGNMENTS ===
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  due_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- === ASSIGNMENT SUBMISSIONS ===
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT,
  grade TEXT,
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  graded_at TIMESTAMPTZ,
  UNIQUE(assignment_id, student_id)
);
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- === CERTIFICATES ===
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pdf_url TEXT,
  qr_code_url TEXT,
  UNIQUE(student_id, course_id)
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- === CRM LEADS ===
CREATE TABLE public.crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT DEFAULT 'website',
  course_interest TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

-- === CRM NOTES ===
CREATE TABLE public.crm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;

-- === WHATSAPP MESSAGES ===
CREATE TABLE public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_phone TEXT NOT NULL,
  contact_name TEXT,
  message_text TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'sent',
  linked_lead_id UUID REFERENCES public.crm_leads(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- === WHATSAPP CAMPAIGNS ===
CREATE TABLE public.whatsapp_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  template_name TEXT,
  message_text TEXT NOT NULL,
  target_audience TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;

-- === ATTENDANCE SESSIONS ===
CREATE TABLE public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL,
  session_title TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;

-- === ATTENDANCE RECORDS ===
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  status TEXT DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late')),
  UNIQUE(session_id, student_id)
);
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- === EXAMS ===
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  exam_type exam_type NOT NULL DEFAULT 'mcq',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_marks NUMERIC(6,2) NOT NULL DEFAULT 100,
  pass_marks NUMERIC(6,2) NOT NULL DEFAULT 40,
  is_published BOOLEAN DEFAULT false,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- === EXAM QUESTIONS ===
CREATE TABLE public.exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'descriptive')),
  options JSONB,
  correct_answer TEXT,
  marks NUMERIC(5,2) NOT NULL DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

-- === EXAM SUBMISSIONS ===
CREATE TABLE public.exam_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  total_score NUMERIC(6,2),
  is_passed BOOLEAN,
  is_graded BOOLEAN DEFAULT false,
  UNIQUE(exam_id, student_id)
);
ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;

-- === EXAM ANSWERS ===
CREATE TABLE public.exam_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.exam_submissions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.exam_questions(id) ON DELETE CASCADE NOT NULL,
  answer_text TEXT,
  is_correct BOOLEAN,
  marks_awarded NUMERIC(5,2) DEFAULT 0,
  UNIQUE(submission_id, question_id)
);
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;

-- === GENERATE INVOICE NUMBER FUNCTION ===
CREATE SEQUENCE IF NOT EXISTS public.invoice_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'RKH-' || TO_CHAR(now(), 'YYYYMM') || '-' || LPAD(nextval('public.invoice_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();

-- === UPDATE TRIGGERS ===
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON public.crm_leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- === RLS POLICIES ===

-- Profiles
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Categories
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Courses
CREATE POLICY "Published courses viewable by all" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Instructors view own courses" ON public.courses FOR SELECT USING (auth.uid() = instructor_id);
CREATE POLICY "Admins view all courses" ON public.courses FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors create courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = instructor_id AND public.has_role(auth.uid(), 'instructor'));
CREATE POLICY "Instructors update own courses" ON public.courses FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Admins manage all courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Course modules
CREATE POLICY "Modules viewable with course" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Instructors manage own course modules" ON public.course_modules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
);

-- Course lessons
CREATE POLICY "Lessons viewable" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Instructors manage lessons" ON public.course_lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.course_modules m JOIN public.courses c ON c.id = m.course_id WHERE m.id = module_id AND c.instructor_id = auth.uid())
);

-- Enrollments
CREATE POLICY "Students view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Instructors view course enrollments" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
);
CREATE POLICY "Admins view all enrollments" ON public.enrollments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Student progress
CREATE POLICY "Students manage own progress" ON public.student_progress FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Instructors view student progress" ON public.student_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.course_lessons l JOIN public.course_modules m ON m.id = l.module_id JOIN public.courses c ON c.id = m.course_id WHERE l.id = lesson_id AND c.instructor_id = auth.uid())
);

-- Cart items
CREATE POLICY "Users manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Order items
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users create own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins view all order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Assignments
CREATE POLICY "Enrolled students view assignments" ON public.assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = assignments.course_id AND student_id = auth.uid())
);
CREATE POLICY "Instructors manage assignments" ON public.assignments FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Admins view assignments" ON public.assignments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Assignment submissions
CREATE POLICY "Students manage own submissions" ON public.assignment_submissions FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Instructors view submissions" ON public.assignment_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_id AND a.created_by = auth.uid())
);
CREATE POLICY "Instructors grade submissions" ON public.assignment_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_id AND a.created_by = auth.uid())
);

-- Certificates
CREATE POLICY "Students view own certs" ON public.certificates FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Public cert verification" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Admins manage certs" ON public.certificates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- CRM leads
CREATE POLICY "Admins manage leads" ON public.crm_leads FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors view assigned leads" ON public.crm_leads FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "Anyone can create leads" ON public.crm_leads FOR INSERT WITH CHECK (true);

-- CRM notes
CREATE POLICY "Admins manage crm notes" ON public.crm_notes FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Note creators view own" ON public.crm_notes FOR SELECT USING (auth.uid() = created_by);

-- WhatsApp messages
CREATE POLICY "Admins manage whatsapp messages" ON public.whatsapp_messages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- WhatsApp campaigns
CREATE POLICY "Admins manage campaigns" ON public.whatsapp_campaigns FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Attendance sessions
CREATE POLICY "Instructors manage attendance sessions" ON public.attendance_sessions FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Admins view attendance sessions" ON public.attendance_sessions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students view own attendance sessions" ON public.attendance_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = attendance_sessions.course_id AND student_id = auth.uid())
);

-- Attendance records
CREATE POLICY "Instructors manage attendance records" ON public.attendance_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.attendance_sessions s WHERE s.id = session_id AND s.created_by = auth.uid())
);
CREATE POLICY "Students view own attendance" ON public.attendance_records FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admins view attendance" ON public.attendance_records FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Exams
CREATE POLICY "Published exams viewable by enrolled" ON public.exams FOR SELECT USING (
  is_published = true AND EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = exams.course_id AND student_id = auth.uid())
);
CREATE POLICY "Instructors manage exams" ON public.exams FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Admins view exams" ON public.exams FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Exam questions
CREATE POLICY "Students view questions during exam" ON public.exam_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.exams e WHERE e.id = exam_id AND e.is_published = true)
);
CREATE POLICY "Instructors manage questions" ON public.exam_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.exams e WHERE e.id = exam_id AND e.created_by = auth.uid())
);

-- Exam submissions
CREATE POLICY "Students manage own exam submissions" ON public.exam_submissions FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Instructors view exam submissions" ON public.exam_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.exams e WHERE e.id = exam_id AND e.created_by = auth.uid())
);
CREATE POLICY "Instructors grade exam submissions" ON public.exam_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.exams e WHERE e.id = exam_id AND e.created_by = auth.uid())
);

-- Exam answers
CREATE POLICY "Students manage own answers" ON public.exam_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.exam_submissions s WHERE s.id = submission_id AND s.student_id = auth.uid())
);
CREATE POLICY "Instructors view answers" ON public.exam_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.exam_submissions s JOIN public.exams e ON e.id = s.exam_id WHERE s.id = submission_id AND e.created_by = auth.uid())
);
CREATE POLICY "Instructors grade answers" ON public.exam_answers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.exam_submissions s JOIN public.exams e ON e.id = s.exam_id WHERE s.id = submission_id AND e.created_by = auth.uid())
);

-- === SEED CATEGORIES ===
INSERT INTO public.categories (name, description) VALUES
  ('DevOps', 'DevOps engineering, CI/CD, containerization'),
  ('Cloud Computing', 'AWS, Azure, GCP cloud services'),
  ('IoT', 'Internet of Things, embedded systems, sensors'),
  ('Software Testing', 'Manual and automation testing, QA');
