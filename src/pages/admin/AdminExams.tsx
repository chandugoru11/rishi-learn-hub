import { useEffect, useState } from "react";
import { Users, BookOpen, DollarSign, BarChart3, UserCheck, Award, MessageSquare, Megaphone, ClipboardList, GraduationCap, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Overview", path: "/admin", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Courses", path: "/admin/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Users", path: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Orders", path: "/admin/orders", icon: <DollarSign className="h-4 w-4" /> },
  { label: "CRM Leads", path: "/admin/crm", icon: <UserCheck className="h-4 w-4" /> },
  { label: "Certificates", path: "/admin/certificates", icon: <Award className="h-4 w-4" /> },
  { label: "WhatsApp", path: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
  { label: "Campaigns", path: "/admin/campaigns", icon: <Megaphone className="h-4 w-4" /> },
  { label: "Attendance", path: "/admin/attendance", icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Exams", path: "/admin/exams", icon: <GraduationCap className="h-4 w-4" /> },
];

export default function AdminExams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exams, setExams] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", course_id: "", exam_type: "mcq", duration_minutes: "60", total_marks: "100", pass_marks: "40" });

  useEffect(() => {
    supabase.from("exams").select("*, courses(title)").order("created_at", { ascending: false }).then(({ data }) => setExams(data || []));
    supabase.from("courses").select("id, title").then(({ data }) => setCourses(data || []));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("exams").insert({
      title: form.title,
      course_id: form.course_id,
      exam_type: form.exam_type as any,
      duration_minutes: Number(form.duration_minutes),
      total_marks: Number(form.total_marks),
      pass_marks: Number(form.pass_marks),
      created_by: user.id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Exam created!" });
      setShowCreate(false);
      const { data } = await supabase.from("exams").select("*, courses(title)").order("created_at", { ascending: false });
      setExams(data || []);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Examination System</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Create Exam
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-surface rounded-xl p-6 shadow-smooth mb-6 grid sm:grid-cols-2 gap-4">
          <input required placeholder="Exam Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <select required value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm">
            <option value="">Select Course</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <select value={form.exam_type} onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
            className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm">
            <option value="mcq">MCQ</option>
            <option value="descriptive">Descriptive</option>
            <option value="mixed">Mixed</option>
          </select>
          <input placeholder="Duration (mins)" type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
            className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm" />
          <input placeholder="Total Marks" type="number" value={form.total_marks} onChange={(e) => setForm({ ...form, total_marks: e.target.value })}
            className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm" />
          <button type="submit" className="sm:col-span-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Create Exam</button>
        </form>
      )}

      <div className="space-y-3">
        {exams.map((e) => (
          <div key={e.id} className="bg-surface rounded-xl p-5 shadow-smooth">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.courses?.title} • {e.duration_minutes} mins • {e.total_marks} marks</p>
                <p className="text-xs text-muted-foreground mt-1">Type: {e.exam_type} • Pass: {e.pass_marks} marks</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${e.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {e.is_published ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        ))}
        {exams.length === 0 && <p className="text-center text-muted-foreground py-8">No exams created yet.</p>}
      </div>
    </DashboardLayout>
  );
}
