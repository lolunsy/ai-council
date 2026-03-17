export interface MeetingModelOption {
  id: string;
  label: string;
  provider: string;
  description: string;
}

export const DEFAULT_MEETING_MODEL = "openrouter/auto";

export const MEETING_MODEL_OPTIONS: MeetingModelOption[] = [
  {
    id: "openrouter/auto",
    label: "Auto",
    provider: "OpenRouter",
    description: "自动选择合适模型，适合先快速验证会议效果。",
  },
  {
    id: "openai/gpt-4o-mini",
    label: "GPT-4o Mini",
    provider: "OpenAI",
    description: "响应更快、成本更低，适合高频测试。",
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    label: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "长文本理解和结构化表达通常更稳。",
  },
  {
    id: "google/gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    provider: "Google",
    description: "适合长上下文推理和复杂材料整合。",
  },
];
