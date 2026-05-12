const FALLBACK_SUMMARY = (audit, formData) => {
  const { totalMonthlySavings, findings } = audit;
  const overspending = findings.filter((f) => f.status === "overspending");

  if (totalMonthlySavings === 0) {
    return `Your team of ${formData.teamSize} is spending efficiently across your AI stack. No major overspend detected. We'll keep monitoring pricing changes and notify you when better options emerge for your use case.`;
  }

  return `Your team of ${formData.teamSize} is spending $${totalMonthlySavings}/month more than necessary on AI tools. ${overspending.length} tool${overspending.length > 1 ? "s are" : " is"} flagged for optimization. Switching to recommended plans could save $${audit.totalAnnualSavings.toLocaleString()} annually — without losing any capability your team relies on.`;
};

export const generateSummary = async (audit, formData) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: `Write a 2-3 sentence personalized audit summary for a startup team.
Team size: ${formData.teamSize}
Use case: ${formData.useCase}
Total monthly savings identified: $${audit.totalMonthlySavings}
Tools flagged: ${audit.findings.filter((f) => f.status !== "optimal").map((f) => f.toolName).join(", ") || "none"}
Overall status: ${audit.isOptimal ? "spending well" : "overspending"}

Be specific, professional, and actionable. Under 100 words.`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    // Graceful fallback if API fails
    return FALLBACK_SUMMARY(audit, formData);
  }
};