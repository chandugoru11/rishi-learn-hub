import { useEffect, useState } from "react";
import { BookOpen, Users, FileText, BarChart3, Plus, PlusCircle, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Overview", path: "/instructor", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "My Courses", path: "/instructor/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Students", path: "/instructor/students", icon: <Users className="h-4 w-4" /> },
  { label: "Assignments", path: "/instructor/assignments", icon: <FileText className="h-4 w-4" /> },
];

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ students: 0, assignments: 0 });
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", short_description: "", price: "", category_id: "" });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("categories").select("*").then(({ data }) => setCategories(data || []));
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const { data: c } = await supabase.from("courses").select("*").eq("instructor_id", user.id);
    setCourses(c || []);
    const courseIds = (c || []).map((x) => x.id);
    if (courseIds.length) {
      const [{ count: sc }, { count: ac }] = await Promise.all([
        supabase.from("enrollments").select("*", { count: "exact", head: true }).in("course_id", courseIds),
        supabase.from("assignments").select("*", { count: "exact", head: true }).eq("created_by", user.id),
      ]);
      setStats({ students: sc || 0, assignments: ac || 0 });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    const { error } = await supabase.from("courses").insert({
      title: newCourse.title,
      description: newCourse.description,
      short_description: newCourse.short_description,
      price: Number(newCourse.price),
      category_id: newCourse.category_id || null,
      instructor_id: user.id,
      is_published: false,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Course created!" });
      setShowCreate(false);
      setNewCourse({ title: "", description: "", short_description: "", price: "", category_id: "" });
      loadData();
    }
    setCreating(false);
  };

  return (
    <DashboardLayout navItems={navItems} title="Instructor">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Instructor Dashboard</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <PlusCircle className="h-4 w-4" /> New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "My Courses", value: courses.length, icon: BookOpen },
          { label: "Total Students", value: stats.students, icon: Users },
          { label: "Assignments", value: stats.assignments, icon: FileText },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-xl p-5 shadow-smooth">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center"><s.icon className="h-5 w-5 text-primary" /></div>
              <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Form */}
      {showCreate && (
        <div className="bg-surface rounded-xl p-6 shadow-smooth mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create New Course</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Course Title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <input required placeholder="Price (₹)" type="number" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
              className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <select value={newCourse.category_id} onChange={(e) => setNewCourse({ ...newCourse, category_id: e.target.value })}
              className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Short Description" value={newCourse.short_description} onChange={(e) => setNewCourse({ ...newCourse, short_description: e.target.value })}
              className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <textarea placeholder="Full Description" rows={3} value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={creating} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                {creating ? "Creating..." : "Create Course"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-2.5 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Courses list */}
      <h2 className="text-lg font-semibold text-foreground mb-4">My Courses</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="bg-surface rounded-xl p-5 shadow-smooth">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">{c.title}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {c.is_published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{c.short_description || "No description"}</p>
            <p className="text-lg font-bold text-primary font-mono">₹{Number(c.price).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
