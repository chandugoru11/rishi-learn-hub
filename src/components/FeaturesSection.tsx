import { motion } from "framer-motion";
import { Monitor, Award, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Online Course Learning",
    description: "Access expert-curated courses anytime, anywhere with our modern learning platform.",
  },
  {
    icon: Award,
    title: "Professional Certification",
    description: "Earn industry-recognized certificates upon course completion with unique verification.",
  },
  {
    icon: Users,
    title: "Instructor Led Programs",
    description: "Learn directly from industry professionals with live sessions and mentorship.",
  },
  {
    icon: BarChart3,
    title: "Student Progress Tracking",
    description: "Monitor your learning journey with detailed analytics and progress dashboards.",
  },
];

const container = { animate: { transition: { staggerChildren: 0.08 } } };
const item = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.5, bounce: 0 } },
};

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-accent">Why Choose Us</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tighter text-foreground">
            Everything you need to accelerate your career
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group relative bg-surface rounded-2xl p-6 shadow-smooth hover:shadow-smooth-hover transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
