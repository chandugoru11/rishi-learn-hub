import { useEffect, useState } from "react";
import { Users, BookOpen, DollarSign, BarChart3, UserCheck, Award, MessageSquare, Megaphone, ClipboardList, GraduationCap, Send } from "lucide-react";
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

export default function AdminWhatsApp() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState({ phone: "", text: "" });

  useEffect(() => {
    supabase.from("whatsapp_messages").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => setMessages(data || []));
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call WhatsApp Business API via edge function
    await supabase.from("whatsapp_messages").insert({
      contact_phone: newMsg.phone,
      message_text: newMsg.text,
      direction: "outbound",
      status: "sent",
    });
    setNewMsg({ phone: "", text: "" });
    const { data } = await supabase.from("whatsapp_messages").select("*").order("created_at", { ascending: false }).limit(50);
    setMessages(data || []);
  };

  return (
    <DashboardLayout navItems={navItems} title="Admin">
      <h1 className="text-2xl font-semibold text-foreground mb-6">WhatsApp Chat</h1>
      
      {/* Send message form */}
      <form onSubmit={sendMessage} className="bg-surface rounded-xl p-5 shadow-smooth mb-6">
        <h3 className="font-semibold text-foreground mb-3">Send Message</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input required placeholder="Phone (+91...)" value={newMsg.phone} onChange={(e) => setNewMsg({ ...newMsg, phone: e.target.value })}
            className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <input required placeholder="Message" value={newMsg.text} onChange={(e) => setNewMsg({ ...newMsg, text: e.target.value })}
            className="flex-[2] px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Send className="h-4 w-4" /> Send
          </button>
        </div>
      </form>

      {/* Messages */}
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`bg-surface rounded-xl p-4 shadow-smooth border-l-4 ${m.direction === "inbound" ? "border-l-emerald-500" : "border-l-primary"}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-foreground">{m.contact_name || m.contact_phone}</p>
                <p className="text-sm text-muted-foreground mt-1">{m.message_text}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded ${m.direction === "inbound" ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"}`}>
                  {m.direction}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-muted-foreground py-8">No messages yet.</p>}
      </div>
    </DashboardLayout>
  );
}
