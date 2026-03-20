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

export default function AdminAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ course_id: "", session_date: "", session_title: "" });

  useEffect(() => {
    supabase.from("attendance_sessions").select("*, courses(title)").order("session_date", { ascending: false }).then(({ data }) => setSessions(data || []));
    supabase.from("courses").select("id, title").then(({ data }) => setCourses(data || []));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("attendance_sessions").insert({ ...form, created_by: user.id });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Session created!" });
      setShowCreate(false);
      const { data } = await supabase.from("attendance_sessions").select("*, courses(title)").order("session_date", { ascending: false });
      setSessions(data || []);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Attendance Management</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Session
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-surface rounded-xl p-6 shadow-smooth mb-6 grid sm:grid-cols-3 gap-4">
          <select required value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm">
            <option value="">Select Course</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input required type="date" value={form.session_date} onChange={(e) => setForm({ ...form, session_date: e.target.value })}
            className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm" />
          <input placeholder="Session Title" value={form.session_title} onChange={(e) => setForm({ ...form, session_title: e.target.value })}
            className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground" />
          <button type="submit" className="sm:col-span-3 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Create Session</button>
        </form>
      )}

      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className="bg-surface rounded-xl p-5 shadow-smooth">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-foreground">{s.session_title || "Session"}</h3>
                <p className="text-sm text-muted-foreground">{s.courses?.title} • {new Date(s.session_date).toLocaleDateString("en-IN")}</p>
              </div>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        ))}
        {sessions.length === 0 && <p className="text-center text-muted-foreground py-8">No attendance sessions yet.</p>}
      </div>
    </DashboardLayout>
  );
}
