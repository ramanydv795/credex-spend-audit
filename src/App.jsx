import { useState, useEffect } from "react";
import SpendForm from "./components/SpendForm";
import AuditResults from "./components/AuditResults";
import LeadCapture from "./components/LeadCapture";
import { runAudit } from "./lib/auditEngine";
import { generateSummary } from "./lib/anthropic";
import { saveAudit, saveLead, getAuditById } from "./lib/supabase";

const STEPS = {
  FORM: "form",
  RESULTS: "results",
};

export default function App() {
  const [step, setStep] = useState(STEPS.FORM);
  const [audit, setAudit] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditId, setAuditId] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [formData, setFormData] = useState(null);

  // Check for shared audit URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("audit");

    if (sharedId) {
      loadSharedAudit(sharedId);
    }
  }, []);

  const loadSharedAudit = async (id) => {
    setLoading(true);

    try {
      const data = await getAuditById(id);

      if (data) {
        setAudit({
          findings: data.findings,
          totalMonthlySavings: data.total_monthly_savings,
          totalAnnualSavings: data.total_annual_savings,
          showCredex: data.total_monthly_savings > 500,
          isOptimal: data.total_monthly_savings < 100,
        });

        setAuditId(id);
        setShareUrl(`${window.location.origin}?audit=${id}`);
        setStep(STEPS.RESULTS);
      }
    } catch (err) {
      console.error("Failed to load shared audit:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setFormData(data);

    try {
      const auditResult = runAudit(data.tools);

      setAudit(auditResult);

     setAiSummary(
  "AI analysis temporarily unavailable. Audit generated successfully."
);
      // Save to Supabase
      const id = await saveAudit(auditResult, data);

      setAuditId(id);
      setShareUrl(`${window.location.origin}?audit=${id}`);

      setStep(STEPS.RESULTS);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (leadData) => {
    await saveLead(leadData, auditId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setStep(STEPS.FORM);
              window.history.pushState({}, "", "/");
            }}
          >
            <span className="text-2xl">🔍</span>

            <span className="font-bold text-gray-900 text-lg">
              SpendLens
            </span>

            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              by Credex
            </span>
          </div>

          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            credex.rocks
          </a>
        </div>
      </nav>

      {/* Hero */}
      {step === STEPS.FORM && (
        <div className="bg-white border-b border-gray-100 py-10 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Are you overpaying for AI tools?
            </h1>

            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Free instant audit. See exactly where your team is overspending
              on AI subscriptions and what to do about it.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />

            <p className="text-gray-500">Running your audit...</p>
          </div>
        ) : step === STEPS.FORM ? (
          <SpendForm onSubmit={handleFormSubmit} />
        ) : (
          <AuditResults
            audit={audit}
            aiSummary={aiSummary}
            shareUrl={shareUrl}
            onCaptureLead={() => setShowLeadCapture(true)}
          />
        )}
      </main>

      {/* Lead capture modal */}
      {showLeadCapture && (
        <LeadCapture
          audit={audit}
          onClose={() => setShowLeadCapture(false)}
          onSubmit={handleLeadSubmit}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400">
        <p>
          SpendLens is a free tool by{" "}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            Credex
          </a>{" "}
          - discounted AI infrastructure credits for startups.
        </p>
      </footer>
    </div>
  );
}