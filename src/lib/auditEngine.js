import { TOOLS } from "../data/pricingData.js";

// AUDIT ENGINE — hardcoded rules, no AI
// A finance person should read this and agree with every decision

const RULES = {
  cursor: ({ plan, seats, useCase }) => {
    const results = [];

    if (plan === "business" && seats <= 2) {
      results.push({
        type: "downgrade",
        message: "Business plan for ≤2 users is overkill. Pro plan covers individuals at half the cost.",
        savingsPerMonth: (40 - 20) * seats,
        recommendation: "Switch to Pro",
      });
    }

    if (plan === "enterprise" && seats <= 10) {
      results.push({
        type: "downgrade",
        message: "Enterprise tier is designed for 10+ seat orgs with compliance needs. Business plan likely sufficient.",
        savingsPerMonth: (100 - 40) * seats,
        recommendation: "Switch to Business",
      });
    }

    if (useCase !== "coding" && plan === "pro") {
      results.push({
        type: "alternative",
        message: "Cursor is optimized for coding. For non-coding use cases, Claude Pro or ChatGPT Plus offers better value.",
        savingsPerMonth: 0,
        recommendation: "Consider Claude Pro for writing/research tasks",
      });
    }

    return results;
  },

  github_copilot: ({ plan, seats, useCase }) => {
    const results = [];

    if (plan === "enterprise" && seats <= 5) {
      results.push({
        type: "downgrade",
        message: "Enterprise Copilot ($39/user) adds policy controls and audit logs — unnecessary for teams under 5.",
        savingsPerMonth: (39 - 19) * seats,
        recommendation: "Switch to Business plan",
      });
    }

    if (useCase === "coding" && plan === "business") {
      results.push({
        type: "alternative",
        message: "Cursor Pro ($20/user) offers stronger AI coding assistance than Copilot Business ($19/user) at similar cost with better model access.",
        savingsPerMonth: 0,
        recommendation: "Evaluate Cursor Pro as alternative",
      });
    }

    return results;
  },

  claude: ({ plan, seats, useCase }) => {
    const results = [];

    if (plan === "max" && seats > 1) {
      results.push({
        type: "downgrade",
        message: "Claude Max ($100/user) is for extremely heavy individual usage. Team plan ($30/user) covers most team workflows.",
        savingsPerMonth: (100 - 30) * seats,
        recommendation: "Switch to Team plan",
      });
    }

    if (plan === "team" && seats <= 3) {
      results.push({
        type: "downgrade",
        message: "Claude Team requires min 5 seats. For ≤3 users, individual Pro plans ($20/user) are cheaper.",
        savingsPerMonth: (30 - 20) * seats,
        recommendation: "Switch to individual Pro plans",
      });
    }

    if (plan === "enterprise" && seats <= 10) {
      results.push({
        type: "downgrade",
        message: "Claude Enterprise pricing is justified for 10+ seat orgs needing SSO and audit logs. Team plan likely sufficient.",
        savingsPerMonth: (60 - 30) * seats,
        recommendation: "Switch to Team plan",
      });
    }

    return results;
  },

  chatgpt: ({ plan, seats, useCase }) => {
    const results = [];

    if (plan === "team" && seats <= 2) {
      results.push({
        type: "downgrade",
        message: "ChatGPT Team ($30/user) for ≤2 users costs more than individual Plus plans ($20/user).",
        savingsPerMonth: (30 - 20) * seats,
        recommendation: "Switch to individual Plus plans",
      });
    }

    if (plan === "enterprise" && seats <= 10) {
      results.push({
        type: "downgrade",
        message: "ChatGPT Enterprise is priced for large orgs. Team plan covers most startup needs at lower cost.",
        savingsPerMonth: (60 - 30) * seats,
        recommendation: "Switch to Team plan",
      });
    }

    if (useCase === "coding" && (plan === "plus" || plan === "team")) {
      results.push({
        type: "alternative",
        message: "For coding-focused teams, Cursor Pro ($20/user) provides a better IDE-native experience than ChatGPT.",
        savingsPerMonth: 0,
        recommendation: "Evaluate Cursor Pro for coding tasks",
      });
    }

    return results;
  },

  anthropic_api: ({ monthlySpend, seats }) => {
    const results = [];

    if (monthlySpend > 500) {
      results.push({
        type: "credits",
        message: `You're spending $${monthlySpend}/mo on Anthropic API directly. Credex can source discounted credits for the same usage.`,
        savingsPerMonth: Math.round(monthlySpend * 0.2),
        recommendation: "Get discounted credits via Credex",
      });
    }

    return results;
  },

  openai_api: ({ monthlySpend }) => {
    const results = [];

    if (monthlySpend > 500) {
      results.push({
        type: "credits",
        message: `You're spending $${monthlySpend}/mo on OpenAI API directly. Credex can source discounted credits for the same usage.`,
        savingsPerMonth: Math.round(monthlySpend * 0.2),
        recommendation: "Get discounted credits via Credex",
      });
    }

    return results;
  },

  gemini: ({ plan, seats }) => {
    const results = [];

    if (plan === "ultra" && seats > 3) {
      results.push({
        type: "alternative",
        message: "Gemini Ultra at $30/user — Claude Team ($30/user) offers comparable capability with stronger reasoning for most tasks.",
        savingsPerMonth: 0,
        recommendation: "Evaluate Claude Team as alternative",
      });
    }

    return results;
  },

  windsurf: ({ plan, seats, useCase }) => {
    const results = [];

    if (plan === "teams" && seats <= 3) {
      results.push({
        type: "downgrade",
        message: "Windsurf Teams ($35/user) for small teams — Pro plan ($15/user) covers most individual dev needs.",
        savingsPerMonth: (35 - 15) * seats,
        recommendation: "Switch to Pro plan",
      });
    }

    return results;
  },
};

// MAIN AUDIT FUNCTION
export const runAudit = (toolInputs) => {
  const findings = [];
  let totalMonthlySavings = 0;

  for (const input of toolInputs) {
    const { toolId, plan, seats, monthlySpend, useCase } = input;

    if (!RULES[toolId]) continue;

    const toolFindings = RULES[toolId]({ plan, seats, monthlySpend, useCase });
    const currentSpend = monthlySpend || 0;

    if (toolFindings.length === 0) {
      findings.push({
        toolId,
        toolName: TOOLS[toolId].name,
        currentSpend,
        status: "optimal",
        message: "You're on the right plan for your usage.",
        recommendations: [],
        savings: 0,
      });
    } else {
      const toolSavings = toolFindings.reduce((sum, f) => sum + (f.savingsPerMonth || 0), 0);
      totalMonthlySavings += toolSavings;

      findings.push({
        toolId,
        toolName: TOOLS[toolId].name,
        currentSpend,
        status: toolSavings > 0 ? "overspending" : "suboptimal",
        recommendations: toolFindings,
        savings: toolSavings,
      });
    }
  }

  return {
    findings,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    showCredex: totalMonthlySavings > 500,
    isOptimal: totalMonthlySavings < 100,
  };
};