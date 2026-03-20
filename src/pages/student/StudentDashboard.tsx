import { useEffect, useState } from "react";
import { BookOpen, Award, ShoppingBag, BarChart3, Play, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Overview", path: "/student", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "My Courses", path: "/student/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Certificates", path: "/student/certificates", icon: <Award className="h-4 w-4" /> },
  { label: "Orders", path: "/student/orders", icon: <ShoppingBag className="h-4 w-4" /> },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("enrollments").select("*, courses(title, thumbnail_url, instructor_id)").eq("student_id", user.id),
      supabase.from("certificates").select("*, courses(title)").eq("student_id", user.id),
      supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]).then(([e, c, o]) => {
      setEnrollments(e.data || []);
      setCertificates(c.data || []);
      setOrders(o.data || []);
    });
  }, [user]);

  return (
    <DashboardLayout navItems={navItems} title="Student">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Enrolled Courses", value: enrollments.length, icon: BookOpen, color: "text-primary" },
          { label: "Certificates", value: certificates.length, icon: Award, color: "text-accent" },
          { label: "Orders", value: orders.length, icon: ShoppingBag, color: "text-emerald-500" },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-xl p-5 shadow-smooth">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <h2 className="text-lg font-semibold text-foreground mb-4">My Courses</h2>
      {enrollments.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 shadow-smooth text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No courses enrolled yet.</p>
          <Link to="/courses" className="inline-block mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((e) => (
            <div key={e.id} className="bg-surface rounded-xl p-4 shadow-smooth">
              {e.courses?.thumbnail_url && (
                <img src={e.courses.thumbnail_url} alt={e.courses.title} className="w-full aspect-video rounded-lg object-cover mb-3" />
              )}
              <h3 className="font-semibold text-foreground">{e.courses?.title}</h3>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{Number(e.progress_percent || 0).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full progress-glow rounded-full transition-all" style={{ width: `${e.progress_percent || 0}%` }} />
                </div>
              </div>
              <Link to={`/student/course/${e.course_id}`} className="mt-3 flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                <Play className="h-4 w-4" /> Continue Learning
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Certificates</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((c) => (
              <div key={c.id} className="bg-surface rounded-xl p-5 shadow-smooth flex items-center gap-4">
                <Award className="h-10 w-10 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{c.courses?.title}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{c.certificate_number}</p>
                </div>
                {c.pdf_url && (
                  <a href={c.pdf_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Download className="h-4 w-4 text-primary" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
