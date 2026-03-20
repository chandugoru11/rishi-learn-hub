import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { hasRole } = useAuth();

  if (hasRole("admin")) return <Navigate to="/admin" replace />;
  if (hasRole("instructor")) return <Navigate to="/instructor" replace />;
  return <Navigate to="/student" replace />;
}
