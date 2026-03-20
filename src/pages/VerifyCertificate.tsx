import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Award, QrCode } from "lucide-react";

export default function VerifyCertificate() {
  const { certId } = useParams();
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("certificates").select("*, courses(title), profiles!certificates_student_id_fkey(full_name)")
      .eq("certificate_number", certId).single()
      .then(({ data }) => { setCert(data); setLoading(false); });
  }, [certId]);

  if (loading) return <main className="pt-24 pb-20 min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></main>;

  if (!cert) return (
    <main className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Award className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-foreground">Certificate Not Found</h1>
        <p className="text-muted-foreground mt-2">The certificate ID <span className="font-mono">{certId}</span> could not be verified.</p>
      </div>
    </main>
  );

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-surface rounded-2xl p-8 shadow-smooth text-center border-2 border-accent/20">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2">✓ Verified Certificate</p>
          <h1 className="text-2xl font-semibold text-foreground mb-1">{cert.courses?.title}</h1>
          <p className="text-muted-foreground">Awarded to <span className="font-medium text-foreground">{cert.profiles?.full_name || "Student"}</span></p>
          <p className="text-xs text-muted-foreground font-mono mt-4">Certificate ID: {cert.certificate_number}</p>
          <p className="text-xs text-muted-foreground">Issued: {new Date(cert.issued_at).toLocaleDateString("en-IN")}</p>
        </div>
      </div>
    </main>
  );
}
