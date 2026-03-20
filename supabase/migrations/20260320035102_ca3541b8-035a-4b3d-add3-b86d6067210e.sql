
-- Fix the permissive CRM leads insert policy to require at minimum a name
-- This is intentionally open for public contact/inquiry forms
DROP POLICY "Anyone can create leads" ON public.crm_leads;
CREATE POLICY "Public can submit leads" ON public.crm_leads 
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (name IS NOT NULL AND length(trim(name)) > 0);
