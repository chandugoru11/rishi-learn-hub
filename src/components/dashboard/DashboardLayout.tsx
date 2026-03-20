import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Menu, X, LogOut, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({ children, navItems, title }: { children: React.ReactNode; navItems: NavItem[]; title: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass flex items-center px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted mr-2">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold text-foreground hidden sm:block">
            Rishi <span className="text-gradient">Knowledge Hub</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">{profile?.full_name || "User"}</span>
          <button onClick={handleSignOut} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Sign Out">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 top-16 z-40 w-64 bg-surface border-r border-border transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-4">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">{title}</p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}>
                  {item.icon}
                  {item.label}
                  {location.pathname === item.path && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
