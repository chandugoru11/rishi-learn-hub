import { motion } from "framer-motion";
import { Award, QrCode, Download, Globe } from "lucide-react";

const features = [
  { icon: Award, title: "Auto-Generated Certificates", desc: "Certificates are automatically generated upon course completion with your name and course details." },
  { icon: QrCode, title: "QR-Based Verification", desc: "Each certificate includes a unique QR code for instant verification by employers." },
  { icon: Download, title: "PDF Download", desc: "Download your certificate as a professionally designed PDF anytime from your dashboard." },
  { icon: Globe, title: "Public Verification Page", desc: "Share a public verification link so anyone can verify your certificate's authenticity." },
];

const transition = { type: "spring", duration: 0.5, bounce: 0 };

export default function Certification() {
  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Certification</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tighter text-foreground">
              Industry-recognized certifications
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Complete your courses and earn verifiable, professional certificates that boost your career credibility.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: i * 0.08 }}
              className="bg-surface rounded-2xl p-6 shadow-smooth"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Sample Certificate Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={transition}
          className="mt-16 max-w-2xl mx-auto bg-surface rounded-2xl shadow-smooth p-8 md:p-12 text-center border-2 border-dashed border-accent/20"
        >
          <Award className="h-16 w-16 text-accent mx-auto mb-4" />
          <p className="text-xs font-bold tracking-widest uppercase text-accent mb-2">Certificate of Completion</p>
          <h3 className="text-2xl font-semibold text-foreground mb-1">DevOps Engineering</h3>
          <p className="text-muted-foreground">Awarded to <span className="font-medium text-foreground">Student Name</span></p>
          <p className="text-xs text-muted-foreground mt-4 font-mono">Certificate ID: RKH-2026-XXXXX</p>
        </motion.div>
      </div>
    </main>
  );
}
