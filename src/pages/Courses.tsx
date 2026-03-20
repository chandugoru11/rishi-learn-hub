import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import courseDevops from "@/assets/course-devops.jpg";
import courseCloud from "@/assets/course-cloud.jpg";
import courseIot from "@/assets/course-iot.jpg";
import courseTesting from "@/assets/course-testing.jpg";

const allCourses = [
  { id: 1, title: "DevOps Engineering", category: "DevOps", instructor: "Rishi Kumar", price: 4999, image: courseDevops },
  { id: 2, title: "Cloud Computing Mastery", category: "Cloud Computing", instructor: "Priya Sharma", price: 5499, image: courseCloud },
  { id: 3, title: "IoT Fundamentals", category: "IoT", instructor: "Anil Reddy", price: 3999, image: courseIot },
  { id: 4, title: "Software Testing Pro", category: "Software Testing", instructor: "Sneha Patil", price: 3499, image: courseTesting },
  { id: 5, title: "Advanced DevOps", category: "DevOps", instructor: "Rishi Kumar", price: 6999, image: courseDevops },
  { id: 6, title: "AWS Solutions Architect", category: "Cloud Computing", instructor: "Priya Sharma", price: 7499, image: courseCloud },
  { id: 7, title: "IoT with Raspberry Pi", category: "IoT", instructor: "Anil Reddy", price: 4499, image: courseIot },
  { id: 8, title: "Automation Testing with Selenium", category: "Software Testing", instructor: "Sneha Patil", price: 4999, image: courseTesting },
];

const categories = ["All", "DevOps", "Cloud Computing", "IoT", "Software Testing"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹4,000", min: 0, max: 4000 },
  { label: "₹4,000 – ₹6,000", min: 4000, max: 6000 },
  { label: "Above ₹6,000", min: 6000, max: Infinity },
];

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceIdx, setPriceIdx] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const range = priceRanges[priceIdx];
    return allCourses.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (c.price < range.min || c.price >= range.max) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.instructor.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category, priceIdx]);

  const addToCart = async (courseTitle: string) => {
    if (!user) { navigate("/login"); return; }
    // For demo courses without DB IDs, show a toast
    toast({ title: "Added to cart!", description: `${courseTitle} added. Full cart integration works with database courses.` });
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-accent">Course Marketplace</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tighter text-foreground">Explore our courses</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search courses or instructors..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={priceIdx} onChange={(e) => setPriceIdx(Number(e.target.value))}
            className="px-4 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            {priceRanges.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground"><p className="text-lg">No courses found matching your filters.</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
                className="group bg-surface rounded-2xl p-4 shadow-smooth hover:shadow-smooth-hover transition-shadow">
                <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-4 outline outline-1 outline-border/30 -outline-offset-1">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-accent/80">{c.category}</span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mt-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">By {c.instructor}</p>
                <div className="flex items-center justify-between pt-4 mt-3 border-t border-muted">
                  <span className="text-xl font-bold tabular-nums text-primary font-mono">₹{c.price.toLocaleString()}</span>
                  <button onClick={() => addToCart(c.title)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1">
                    <ShoppingCart className="h-3.5 w-3.5" /> Enroll
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
