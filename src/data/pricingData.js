// PRICING DATA — All prices verified May 2026
// Sources cited in PRICING_DATA.md

export const TOOLS = {
  cursor: {
    name: "Cursor",
    plans: {
      hobby: { name: "Hobby", pricePerUser: 0, description: "Free tier" },
      pro: { name: "Pro", pricePerUser: 20, description: "For individual devs" },
      business: { name: "Business", pricePerUser: 40, description: "For teams" },
      enterprise: { name: "Enterprise", pricePerUser: 100, description: "Custom" },
    },
  },
  github_copilot: {
    name: "GitHub Copilot",
    plans: {
      individual: { name: "Individual", pricePerUser: 10, description: "For individuals" },
      business: { name: "Business", pricePerUser: 19, description: "For teams" },
      enterprise: { name: "Enterprise", pricePerUser: 39, description: "For large orgs" },
    },
  },
  claude: {
    name: "Claude (Anthropic)",
    plans: {
      free: { name: "Free", pricePerUser: 0, description: "Basic access" },
      pro: { name: "Pro", pricePerUser: 20, description: "For individuals" },
      max: { name: "Max", pricePerUser: 100, description: "Heavy usage" },
      team: { name: "Team", pricePerUser: 30, description: "Min 5 users" },
      enterprise: { name: "Enterprise", pricePerUser: 60, description: "Custom" },
    },
  },
  chatgpt: {
    name: "ChatGPT (OpenAI)",
    plans: {
      free: { name: "Free", pricePerUser: 0, description: "Basic GPT-4o" },
      plus: { name: "Plus", pricePerUser: 20, description: "For individuals" },
      team: { name: "Team", pricePerUser: 30, description: "Min 2 users" },
      enterprise: { name: "Enterprise", pricePerUser: 60, description: "Custom" },
    },
  },
  anthropic_api: {
    name: "Anthropic API",
    plans: {
      direct: { name: "API Direct", pricePerUser: 0, description: "Pay per token" },
    },
  },
  openai_api: {
    name: "OpenAI API",
    plans: {
      direct: { name: "API Direct", pricePerUser: 0, description: "Pay per token" },
    },
  },
  gemini: {
    name: "Google Gemini",
    plans: {
      free: { name: "Free", pricePerUser: 0, description: "Basic access" },
      pro: { name: "Pro", pricePerUser: 20, description: "For individuals" },
      ultra: { name: "Ultra", pricePerUser: 30, description: "Most capable" },
    },
  },
  windsurf: {
    name: "Windsurf",
    plans: {
      free: { name: "Free", pricePerUser: 0, description: "Basic access" },
      pro: { name: "Pro", pricePerUser: 15, description: "For individuals" },
      teams: { name: "Teams", pricePerUser: 35, description: "For teams" },
    },
  },
};

export const USE_CASES = [
  { value: "coding", label: "Coding / Development" },
  { value: "writing", label: "Writing / Content" },
  { value: "data", label: "Data Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / General" },
];

export const TOOL_LIST = Object.keys(TOOLS);