import { useState } from "react";

const STATUS_COLORS = {
  optimal: "bg-green-50 border-green-200",
  overspending: "bg-red-50 border-red-200",
  suboptimal: "bg-yellow-50 border-yellow-200",
};

const STATUS_BADGE = {
  optimal: "bg-green-100 text-green-700",
  overspending: "bg-red-100 text-red-700",
  suboptimal: "bg-yellow-100 text-yellow-700",
};

const STATUS_LABEL = {
  optimal: "✅ Optimized",
  overspending: "🔴 Overspending",
  suboptimal: "⚠️ Suboptimal",
};

export default function AuditResults({
  audit,
  aiSummary,
  onCaptureLead,
  shareUrl,
}) {
  const {
    findings,
    totalMonthlySavings,
    totalAnnualSavings,
    showCredex,
    isOptimal,
  } = audit;

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My AI Spend Audit",
          text: "Check out my AI spend audit results!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Hero Section */}
      <div className="text-center mb-10">
        <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">
          Your AI Spend Audit
        </p>

        {isOptimal ? (
          <>
            <h2 className="text-4xl font-bold text-green-600 mb-2">
              You're spending well 🎉
            </h2>

            <p className="text-gray-500">
              No major overspend detected. We'll notify you when optimizations
              apply to your stack.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-5xl font-bold text-gray-900 mb-1">
              ${totalMonthlySavings.toLocaleString()}
              <span className="text-2xl text-gray-400 font-normal">
                /mo
              </span>
            </h2>

            <p className="text-green-600 font-semibold text-xl mb-1">
              potential savings identified
            </p>

            <p className="text-gray-400 text-sm">
              ${totalAnnualSavings.toLocaleString()} saved annually
            </p>
          </>
        )}

        {/* Share Button */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={handleShare}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {copied ? "✅ Link Copied!" : "🔗 Share Audit"}
          </button>
        </div>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-blue-400 uppercase tracking-wide mb-1 font-medium">
            AI Summary
          </p>

          <p className="text-gray-700 text-sm leading-relaxed">
            {aiSummary}
          </p>
        </div>
      )}

      {/* Credex CTA */}
      {showCredex && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-5 mb-6 text-white">
          <h3 className="font-bold text-lg mb-1">
            💰 Capture more savings with Credex
          </h3>

          <p className="text-green-100 text-sm mb-3">
            You're spending over $500/mo on AI tools. Credex sources discounted
            credits for Cursor, Claude, ChatGPT and more — from companies that
            overforecast. Real discounts, same tools.
          </p>

          <button
            onClick={onCaptureLead}
            className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-50 transition-colors"
          >
            Book a Free Credex Consultation →
          </button>
        </div>
      )}

      {/* Tool Breakdown */}
      <div className="space-y-4 mb-8">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Tool Breakdown
        </h3>

        {findings.map((finding) => (
          <div
            key={finding.toolId}
            className={`border rounded-xl p-4 ${STATUS_COLORS[finding.status]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">
                {finding.toolName}
              </span>

              <div className="flex items-center gap-2">
                {finding.savings > 0 && (
                  <span className="text-green-600 font-bold text-sm">
                    Save ${finding.savings}/mo
                  </span>
                )}

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[finding.status]}`}
                >
                  {STATUS_LABEL[finding.status]}
                </span>
              </div>
            </div>

            {finding.status === "optimal" ? (
              <p className="text-sm text-gray-500">
                {finding.message}
              </p>
            ) : (
              <div className="space-y-2">
                {finding.recommendations.map((rec, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-gray-700">{rec.message}</p>

                    <p className="text-green-700 font-medium mt-0.5">
                      → {rec.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lead Capture CTA */}
      <div className="border border-gray-200 rounded-xl p-5 text-center">
        <h3 className="font-semibold text-gray-900 mb-1">
          {isOptimal
            ? "Stay ahead of AI pricing changes"
            : "Get your full report + save this audit"}
        </h3>

        <p className="text-gray-500 text-sm mb-4">
          {isOptimal
            ? "We'll notify you when new optimizations apply to your stack."
            : "Enter your email to receive this audit and get notified when better deals apply."}
        </p>

        <button
          onClick={onCaptureLead}
          className="bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {isOptimal ? "Notify Me →" : "Get My Free Report →"}
        </button>
      </div>
    </div>
  );
}