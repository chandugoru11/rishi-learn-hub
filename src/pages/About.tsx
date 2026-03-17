import { motion } from "framer-motion";
import { Target, Eye, Shield, Zap } from "lucide-react";

const reasons = [
  { icon: Zap, title: "Industry-Ready Curriculum", desc: "Courses designed with input from industry leaders to ensure job relevance." },
  { icon: Shield, title: "Certified Programs", desc: "Every course comes with a verifiable professional certification." },
  { icon: Target, title: "Hands-On Learning", desc: "Lab-based training with real-world projects and assignments." },
  { icon: Eye, title: "Expert Instructors", desc: "Learn from professionals with 10+ years of industry experience." },
];

const transition = { type: "spring", duration: 0.5, bounce: 0 };

export default function About() {
  return (
    <main className="pt-24">
      {/* Intro */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            <span className="text-xs font-bold tracking-widest uppercase text-accent">About Us</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tighter text-foreground">
              Empowering the next generation of tech professionals
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Rishi Knowledge Hub is an EdTech platform committed to bridging the gap between academic learning and industry requirements. We deliver high-quality, instructor-led programs in DevOps, Cloud Computing, IoT, and Software Testing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 max-w-4xl">
          {[
            { title: "Our Vision", text: "To become India's most trusted platform for technology education, where every learner can access world-class training regardless of their background." },
            { title: "Our Mission", text: "To deliver practical, certification-backed tech courses that prepare students for real-world challenges and accelerate their career growth." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: i * 0.1 }}
              className="bg-surface rounded-2xl p-8 shadow-smooth"
            >
              <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tighter text-foreground text-center mb-12">
            Why Choose Rishi Knowledge Hub
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...transition, delay: i * 0.08 }}
                className="bg-surface rounded-2xl p-6 shadow-smooth text-center"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                  <r.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{r.title}</h4>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
