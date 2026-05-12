import { useState, useEffect } from "react";
import { TOOLS, USE_CASES } from "../data/pricingData.js";

const DEFAULT_ENTRY = (toolId) => ({
  toolId,
  enabled: false,
  plan: Object.keys(TOOLS[toolId].plans)[0],
  seats: 1,
  monthlySpend: 0,
  useCase: "mixed",
});

const STORAGE_KEY = "credex_audit_form";

export default function SpendForm({ onSubmit }) {
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState("mixed");
  const [tools, setTools] = useState(() => {
    // Persist form state across page reloads
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return Object.keys(TOOLS).map(DEFAULT_ENTRY);
  });

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  }, [tools]);

  const updateTool = (index, field, value) => {
    setTools((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = () => {
    const enabledTools = tools
      .filter((t) => t.enabled)
      .map((t) => ({ ...t, useCase }));

    if (enabledTools.length === 0) {
      alert("Please select at least one AI tool.");
      return;
    }

    onSubmit({ tools: enabledTools, teamSize, useCase });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Audit Your AI Spend
        </h2>
        <p className="text-gray-500">
          Select the tools you pay for and we'll find where you're overspending.
        </p>
      </div>

      {/* Team Info */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Size
          </label>
          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Use Case
          </label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {USE_CASES.map((uc) => (
              <option key={uc.value} value={uc.value}>
                {uc.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="space-y-3 mb-8">
        {tools.map((tool, index) => {
          const toolData = TOOLS[tool.toolId];
          return (
            <div
              key={tool.toolId}
              className={`border rounded-xl p-4 transition-all ${
                tool.enabled
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Tool Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={tool.enabled}
                    onChange={(e) => updateTool(index, "enabled", e.target.checked)}
                    className="w-4 h-4 accent-green-500"
                  />
                  <span className="font-medium text-gray-900">
                    {toolData.name}
                  </span>
                </div>
              </div>

              {/* Tool Details — only show if enabled */}
              {tool.enabled && (
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Plan</label>
                    <select
                      value={tool.plan}
                      onChange={(e) => updateTool(index, "plan", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {Object.entries(toolData.plans).map(([key, plan]) => (
                        <option key={key} value={key}>
                          {plan.name} — ${plan.pricePerUser}/user
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Seats</label>
                    <input
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={(e) => updateTool(index, "seats", Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Monthly Spend ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tool.monthlySpend}
                      onChange={(e) => updateTool(index, "monthlySpend", Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors text-lg"
      >
        Run My Free Audit →
      </button>
    </div>
  );
}