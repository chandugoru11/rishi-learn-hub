import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Certification", path: "/certification" },
  { label: "Contact", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold text-primary-foreground">Rishi Knowledge Hub</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/60">
              Empowering learners with industry-relevant tech skills and professional certifications.
            </p>
            <p className="text-xs text-primary-foreground/40">Development Partner: OneTo7 Solutions</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                +91 9403891264
              </li>
              <li className="flex gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                enquiry@oneto7solutions.in
              </li>
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>3rd Floor, No 1-1-61, Plot No 6 H, Mohan Nagar, Srinagar Colony, Kothapet, Hyderabad, Telangana 500035</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {["Facebook", "Twitter", "LinkedIn", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/5 hover:bg-primary/20 flex items-center justify-center text-xs font-bold text-primary-foreground/60 hover:text-primary transition-colors"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} Rishi Knowledge Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
