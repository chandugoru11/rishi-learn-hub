import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: AppRole }) {
  const { user, loading, hasRole } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && !hasRole(requiredRole) && !hasRole("admin")) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
