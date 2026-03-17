import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import courseDevops from "@/assets/course-devops.jpg";
import courseCloud from "@/assets/course-cloud.jpg";
import courseIot from "@/assets/course-iot.jpg";
import courseTesting from "@/assets/course-testing.jpg";

const courses = [
  { title: "DevOps Engineering", category: "DevOps", instructor: "Rishi Kumar", price: "4,999", image: courseDevops },
  { title: "Cloud Computing Mastery", category: "Cloud Computing", instructor: "Priya Sharma", price: "5,499", image: courseCloud },
  { title: "IoT Fundamentals", category: "IoT", instructor: "Anil Reddy", price: "3,999", image: courseIot },
  { title: "Software Testing Pro", category: "Software Testing", instructor: "Sneha Patil", price: "3,499", image: courseTesting },
];

const container = { animate: { transition: { staggerChildren: 0.08 } } };
const item = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, duration: 0.5, bounce: 0 } },
};

export default function CoursePreviewSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Popular Courses</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tighter text-foreground">
              Start your learning journey
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all courses →
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {courses.map((c) => (
            <motion.div
              key={c.title}
              variants={item}
              whileHover={{ y: -4 }}
              className="group bg-surface rounded-2xl p-4 shadow-smooth hover:shadow-smooth-hover transition-shadow"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-4 outline outline-1 outline-border/30 -outline-offset-1">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-widest uppercase text-accent/80">
                  {c.category}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground">By {c.instructor}</p>
                <div className="flex items-center justify-between pt-4 border-t border-muted">
                  <span className="text-xl font-bold tabular-nums text-primary font-mono">₹{c.price}</span>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
