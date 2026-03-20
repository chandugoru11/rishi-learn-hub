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

export default function AdminCampaigns() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", message_text: "", target_audience: "", scheduled_at: "" });

  useEffect(() => {
    supabase.from("whatsapp_campaigns").select("*").order("created_at", { ascending: false }).then(({ data }) => setCampaigns(data || []));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("whatsapp_campaigns").insert({
      ...form,
      scheduled_at: form.scheduled_at || null,
      created_by: user.id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Campaign created!" });
      setShowCreate(false);
      const { data } = await supabase.from("whatsapp_campaigns").select("*").order("created_at", { ascending: false });
      setCampaigns(data || []);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">WhatsApp Campaigns</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-surface rounded-xl p-6 shadow-smooth mb-6 space-y-4">
          <input required placeholder="Campaign Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <textarea required placeholder="Message Text" rows={3} value={form.message_text} onChange={(e) => setForm({ ...form, message_text: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Target Audience" value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
              className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
              className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Create</button>
        </form>
      )}

      <div className="space-y-3">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-surface rounded-xl p-5 shadow-smooth">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.message_text}</p>
                {c.target_audience && <p className="text-xs text-accent mt-1">Audience: {c.target_audience}</p>}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === "sent" ? "bg-emerald-100 text-emerald-700" : c.status === "scheduled" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                {c.status}
              </span>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span>Sent: {c.sent_count}</span>
              <span>Delivered: {c.delivered_count}</span>
              <span>Read: {c.read_count}</span>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && <p className="text-center text-muted-foreground py-8">No campaigns yet.</p>}
      </div>
    </DashboardLayout>
  );
}
