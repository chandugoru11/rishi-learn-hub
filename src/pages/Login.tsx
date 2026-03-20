import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const transition = { type: "spring" as const, duration: 0.5, bounce: 0 };

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "student" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "We've sent you a password reset link." });
        setIsForgot(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.fullName, role: form.role },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: "Account created!", description: "Please check your email to verify your account." });
        setIsLogin(true);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="max-w-md mx-auto bg-surface rounded-2xl p-8 shadow-smooth">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold text-foreground">Rishi Knowledge Hub</span>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {isForgot ? "Reset password" : isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isForgot ? "Enter your email to receive a reset link" : isLogin ? "Sign in to continue learning" : "Start your learning journey today"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && !isForgot && (
              <input required type="text" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            )}
            <input required type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            {!isForgot && (
              <input required type="password" placeholder="Password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            )}
            {!isLogin && !isForgot && (
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            )}
            {isLogin && !isForgot && (
              <div className="text-right">
                <button type="button" onClick={() => setIsForgot(true)} className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</button>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isForgot ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isForgot ? (
              <button onClick={() => setIsForgot(false)} className="text-primary font-medium hover:text-primary/80 transition-colors">Back to Sign In</button>
            ) : (
              <>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:text-primary/80 transition-colors">
                  {isLogin ? "Register" : "Sign In"}
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </main>
  );
}
