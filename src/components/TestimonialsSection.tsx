import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "DevOps Engineer at TCS",
    text: "Rishi Knowledge Hub transformed my career. The DevOps course was comprehensive and practical — I landed my dream job within 3 months of completing it.",
  },
  {
    name: "Kavitha Rao",
    role: "Cloud Architect at Infosys",
    text: "The hands-on labs and instructor support made learning cloud computing incredibly smooth. Highly recommend this platform for anyone in tech.",
  },
  {
    name: "Rahul Verma",
    role: "IoT Developer at Wipro",
    text: "The IoT course gave me real-world skills that I could apply immediately. The certification added great credibility to my resume.",
  },
];

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-accent">Testimonials</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tighter text-foreground">
            What our students say
          </h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-surface rounded-2xl p-8 md:p-10 shadow-smooth text-center"
            >
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-foreground mb-6">
                "{testimonials[idx].text}"
              </p>
              <p className="font-semibold text-foreground">{testimonials[idx].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[idx].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={prev}
              className="p-2 rounded-lg bg-surface shadow-smooth hover:shadow-smooth-hover transition-shadow text-muted-foreground hover:text-foreground"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === idx ? "bg-primary" : "bg-border"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
            <button
              onClick={next}
              className="p-2 rounded-lg bg-surface shadow-smooth hover:shadow-smooth-hover transition-shadow text-muted-foreground hover:text-foreground"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
