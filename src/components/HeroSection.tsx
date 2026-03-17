import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import heroImg from "@/assets/hero-illustration.jpg";

const transition = { type: "spring", duration: 0.6, bounce: 0 };

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                Learn. Build. Grow.
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.1] text-foreground">
              Streamline Your Learning with{" "}
              <span className="text-gradient">Rishi Knowledge Hub</span>
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground max-w-lg">
              Master in-demand tech skills with expert-led courses in DevOps, Cloud Computing, IoT, and Software Testing. Professional certification included.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-smooth"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface text-foreground font-medium hover:bg-muted transition-colors shadow-smooth border border-border"
              >
                Become Instructor
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...transition, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-smooth-hover outline outline-1 outline-border/50 -outline-offset-1">
              <img
                src={heroImg}
                alt="EdTech platform illustration"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 glass rounded-xl p-4 shadow-smooth"
            >
              <p className="text-2xl font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Students Enrolled</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
