import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, GraduationCap } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-surface rounded-2xl p-8 shadow-smooth">
          <div className="text-center mb-8">
            <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-semibold text-foreground">Set New Password</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="password" minLength={6} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Update Password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
