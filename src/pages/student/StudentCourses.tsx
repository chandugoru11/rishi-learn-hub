import { useEffect, useState } from "react";
import { BookOpen, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import { BarChart3, Award, ShoppingBag } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/student", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "My Courses", path: "/student/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Certificates", path: "/student/certificates", icon: <Award className="h-4 w-4" /> },
  { label: "Orders", path: "/student/orders", icon: <ShoppingBag className="h-4 w-4" /> },
];

export default function StudentCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("enrollments").select("*, courses(title, thumbnail_url, short_description)").eq("student_id", user.id)
      .then(({ data }) => setEnrollments(data || []));
  }, [user]);

  return (
    <DashboardLayout navItems={navItems} title="Student">
      <h1 className="text-2xl font-semibold text-foreground mb-6">My Courses</h1>
      {enrollments.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 shadow-smooth text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e) => (
            <div key={e.id} className="bg-surface rounded-xl shadow-smooth overflow-hidden">
              {e.courses?.thumbnail_url && <img src={e.courses.thumbnail_url} alt="" className="w-full aspect-video object-cover" />}
              <div className="p-5">
                <h3 className="font-semibold text-foreground mb-1">{e.courses?.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{e.courses?.short_description}</p>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span><span>{Number(e.progress_percent || 0).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div className="h-full progress-glow rounded-full" style={{ width: `${e.progress_percent || 0}%` }} />
                </div>
                <Link to={`/student/course/${e.course_id}`} className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Play className="h-4 w-4" /> Continue
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
