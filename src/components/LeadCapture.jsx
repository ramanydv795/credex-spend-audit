import { useState } from "react";

export default function LeadCapture({ audit, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    setLoading(true);

    try {
      await onSubmit({ email, company, role });
      setDone(true);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            You're all set!
          </h3>
          <p className="text-gray-500 mb-2">
            Your audit report is on its way to{" "}
            <span className="font-medium text-gray-900">{email}</span>.
          </p>
          {audit?.showCredex && (
            <p className="text-green-600 text-sm font-medium mb-4">
              Our team will reach out about your $
              {audit.totalMonthlySavings.toLocaleString()}/mo savings opportunity.
            </p>
          )}
          <button
            onClick={onClose}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Get your free report
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              We'll email your full audit. No spam, ever.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Savings reminder */}
        {audit?.totalMonthlySavings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5">
            <p className="text-green-700 text-sm font-medium">
              💰 ${audit.totalMonthlySavings.toLocaleString()}/mo in savings
              identified — let's make sure you capture them.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          {/* Honeypot — hidden from real users, bots fill this */}
          <input
            type="text"
            name="website"
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Role
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Select role</option>
              <option value="founder">Founder / Co-founder</option>
              <option value="cto">CTO / VP Engineering</option>
              <option value="engineer">Engineer</option>
              <option value="manager">Engineering Manager</option>
              <option value="finance">Finance / Ops</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-xl mt-5 transition-colors"
        >
          {loading ? "Sending..." : "Send My Report →"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          No credit card. No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}