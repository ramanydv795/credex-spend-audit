import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Save audit to Supabase and return shareable ID
export const saveAudit = async (audit, formData) => {
  const { data, error } = await supabase
    .from("audits")
    .insert({
      tools: formData.tools,
      findings: audit.findings,
      total_monthly_savings: audit.totalMonthlySavings,
      total_annual_savings: audit.totalAnnualSavings,
      team_size: formData.teamSize,
      use_case: formData.useCase,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

// Save lead to Supabase
export const saveLead = async (leadData, auditId) => {
  const { error } = await supabase
    .from("leads")
    .insert({
      email: leadData.email,
      company: leadData.company || null,
      role: leadData.role || null,
      audit_id: auditId || null,
    });

  if (error) throw error;
};

// Get audit by ID for shareable URL
export const getAuditById = async (id) => {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};