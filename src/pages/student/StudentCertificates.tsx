import { useEffect, useState } from "react";
import { BookOpen, BarChart3, Award, ShoppingBag, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const navItems = [
  { label: "Overview", path: "/student", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "My Courses", path: "/student/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Certificates", path: "/student/certificates", icon: <Award className="h-4 w-4" /> },
  { label: "Orders", path: "/student/orders", icon: <ShoppingBag className="h-4 w-4" /> },
];

export default function StudentCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("certificates").select("*, courses(title)").eq("student_id", user.id)
      .then(({ data }) => setCertificates(data || []));
  }, [user]);

  return (
    <DashboardLayout navItems={navItems} title="Student">
      <h1 className="text-2xl font-semibold text-foreground mb-6">My Certificates</h1>
      {certificates.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 shadow-smooth text-center">
          <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Complete a course to earn your certificate.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {certificates.map((c) => (
            <div key={c.id} className="bg-surface rounded-xl p-6 shadow-smooth border-2 border-dashed border-accent/20">
              <Award className="h-12 w-12 text-accent mb-3" />
              <p className="text-xs font-bold tracking-widest uppercase text-accent mb-1">Certificate of Completion</p>
              <h3 className="text-xl font-semibold text-foreground">{c.courses?.title}</h3>
              <p className="text-xs text-muted-foreground font-mono mt-2">{c.certificate_number}</p>
              <p className="text-xs text-muted-foreground mt-1">Issued: {new Date(c.issued_at).toLocaleDateString("en-IN")}</p>
              {c.pdf_url && (
                <a href={c.pdf_url} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Download className="h-4 w-4" /> Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
