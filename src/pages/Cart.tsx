import { useEffect, useState } from "react";
import { ShoppingCart, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("cart_items").select("*, courses(id, title, price, discount_price, thumbnail_url, instructor_id)")
      .eq("user_id", user.id).then(({ data }) => { setItems(data || []); setLoading(false); });
  }, [user]);

  const removeItem = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + Number(i.courses?.discount_price || i.courses?.price || 0), 0);

  const handleCheckout = async () => {
    if (!user || items.length === 0) return;
    setCheckingOut(true);

    // Create order
    const { data: order, error: orderErr } = await supabase.from("orders").insert({
      user_id: user.id,
      total_amount: total,
      status: "pending",
      payment_method: "razorpay",
    }).select().single();

    if (orderErr || !order) {
      toast({ title: "Error", description: orderErr?.message || "Failed to create order", variant: "destructive" });
      setCheckingOut(false);
      return;
    }

    // Create order items
    const orderItems = items.map((i) => ({
      order_id: order.id,
      course_id: i.courses.id,
      price: Number(i.courses.discount_price || i.courses.price),
    }));
    await supabase.from("order_items").insert(orderItems);

    // Simulate Razorpay payment (in production, integrate real Razorpay SDK)
    // For now, mark as paid and enroll
    await supabase.from("orders").update({ status: "paid", payment_id: `rzp_sim_${Date.now()}` }).eq("id", order.id);

    // Auto-enroll student
    const enrollments = items.map((i) => ({
      student_id: user.id,
      course_id: i.courses.id,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }));
    await supabase.from("enrollments").insert(enrollments);

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    toast({ title: "Payment successful!", description: "You've been enrolled in your courses." });
    setCheckingOut(false);
    navigate("/student");
  };

  if (loading) return (
    <main className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </main>
  );

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-semibold text-foreground mb-8">
          <ShoppingCart className="inline h-8 w-8 mr-2 text-primary" /> Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-surface rounded-xl p-12 shadow-smooth text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="bg-surface rounded-xl p-4 shadow-smooth flex items-center gap-4">
                  {item.courses?.thumbnail_url && (
                    <img src={item.courses.thumbnail_url} alt="" className="w-24 h-16 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.courses?.title}</h3>
                    <p className="text-lg font-bold text-primary font-mono">
                      ₹{Number(item.courses?.discount_price || item.courses?.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-xl p-6 shadow-smooth">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary font-mono">₹{total.toLocaleString()}</span>
              </div>
              <button onClick={handleCheckout} disabled={checkingOut}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {checkingOut && <Loader2 className="h-4 w-4 animate-spin" />}
                {checkingOut ? "Processing..." : "Pay with Razorpay"}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">Secure payment via Razorpay. You'll be enrolled automatically after payment.</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
