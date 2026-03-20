import { useEffect, useState } from "react";
import { BookOpen, BarChart3, Award, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const navItems = [
  { label: "Overview", path: "/student", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "My Courses", path: "/student/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Certificates", path: "/student/certificates", icon: <Award className="h-4 w-4" /> },
  { label: "Orders", path: "/student/orders", icon: <ShoppingBag className="h-4 w-4" /> },
];

export default function StudentOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*, order_items(*, courses(title))").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, [user]);

  return (
    <DashboardLayout navItems={navItems} title="Student">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Order History</h1>
      {orders.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 shadow-smooth text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-surface rounded-xl p-5 shadow-smooth">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">{o.invoice_number}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === "paid" ? "bg-emerald-100 text-emerald-700" : o.status === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {o.status}
                  </span>
                  <span className="text-lg font-bold text-foreground">₹{Number(o.total_amount).toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-1">
                {o.order_items?.map((item: any) => (
                  <p key={item.id} className="text-sm text-muted-foreground">• {item.courses?.title} — ₹{Number(item.price).toLocaleString()}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
