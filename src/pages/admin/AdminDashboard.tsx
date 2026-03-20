import { useEffect, useState } from "react";
import { Users, BookOpen, DollarSign, BarChart3, UserCheck, Award, FileText, MessageSquare, Settings, Megaphone, ClipboardList, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

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

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, orders: 0, revenue: 0, leads: 0, enrollments: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total_amount, status"),
      supabase.from("crm_leads").select("*", { count: "exact", head: true }),
      supabase.from("enrollments").select("*", { count: "exact", head: true }),
    ]).then(([p, c, o, l, e]) => {
      const paidOrders = (o.data || []).filter((x) => x.status === "paid");
      setStats({
        students: p.count || 0,
        courses: c.count || 0,
        orders: (o.data || []).length,
        revenue: paidOrders.reduce((sum, x) => sum + Number(x.total_amount), 0),
        leads: l.count || 0,
        enrollments: e.count || 0,
      });
    });
  }, []);

  const widgets = [
    { label: "Total Users", value: stats.students, icon: Users, color: "text-primary" },
    { label: "Active Courses", value: stats.courses, icon: BookOpen, color: "text-accent" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
    { label: "Total Orders", value: stats.orders, icon: FileText, color: "text-amber-500" },
    { label: "CRM Leads", value: stats.leads, icon: UserCheck, color: "text-rose-500" },
    { label: "Enrollments", value: stats.enrollments, icon: GraduationCap, color: "text-indigo-500" },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Admin">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {widgets.map((w) => (
          <div key={w.label} className="bg-surface rounded-xl p-5 shadow-smooth">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <w.icon className={`h-6 w-6 ${w.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{w.value}</p>
                <p className="text-sm text-muted-foreground">{w.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-surface rounded-xl p-6 shadow-smooth">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Manage Courses", path: "/admin/courses" },
            { label: "View CRM Leads", path: "/admin/crm" },
            { label: "WhatsApp Chat", path: "/admin/whatsapp" },
          ].map((a) => (
            <a key={a.path} href={a.path} className="px-4 py-3 bg-muted rounded-lg text-sm font-medium text-foreground hover:bg-muted/80 transition-colors text-center">
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
