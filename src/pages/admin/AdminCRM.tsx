import { useEffect, useState } from "react";
import { Users, BookOpen, DollarSign, BarChart3, UserCheck, Award, MessageSquare, Megaphone, ClipboardList, GraduationCap } from "lucide-react";
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

export default function AdminCRM() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    supabase.from("crm_leads").select("*").order("created_at", { ascending: false }).then(({ data }) => setLeads(data || []));
  }, []);

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("crm_leads").update({ status }).eq("id", id);
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin">
      <h1 className="text-2xl font-semibold text-foreground mb-6">CRM Leads</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "new", "contacted", "qualified", "converted", "lost"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((l) => (
          <div key={l.id} className="bg-surface rounded-xl p-5 shadow-smooth">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">{l.name}</h3>
                <p className="text-sm text-muted-foreground">{l.email} {l.phone && `• ${l.phone}`}</p>
                {l.course_interest && <p className="text-xs text-accent mt-1">Interested in: {l.course_interest}</p>}
                <p className="text-xs text-muted-foreground mt-1">Source: {l.source} • {new Date(l.created_at).toLocaleDateString("en-IN")}</p>
              </div>
              <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No leads found.</p>}
      </div>
    </DashboardLayout>
  );
}
