import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, ShoppingCart, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Certification", path: "/certification" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            Rishi <span className="text-gradient">Knowledge Hub</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`group relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}>
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/cart" className="ml-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="ml-1 px-5 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="ml-1 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Sign Out">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link to="/login" className="ml-2 px-5 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Login / Register
            </Link>
          )}
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors" aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-foreground/20 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
            <motion.nav initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="fixed right-0 top-16 bottom-0 w-72 bg-surface shadow-smooth-hover p-6 flex flex-col gap-2 md:hidden">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}>
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/cart" onClick={() => setOpen(false)} className="px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Cart
                  </Link>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="mt-2 px-5 py-3 rounded-md text-sm font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={() => { handleSignOut(); setOpen(false); }} className="px-5 py-3 rounded-md text-sm font-medium text-center bg-muted text-foreground hover:bg-muted/80 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="mt-4 px-5 py-3 rounded-md text-sm font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Login / Register
                </Link>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
