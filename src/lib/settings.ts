import type { MeetingRuntimeSettings } from "@/types/settings";

export const DEFAULT_RUNTIME_SETTINGS: MeetingRuntimeSettings = {
  providerType: "openai_compatible",
  authMode: "bearer",
  baseUrl: " `https://openrouter.ai` ",
  apiKey: "",
  model: "openrouter/auto",
};

const STORAGE_KEY = "ai-council-runtime-settings";

export function readRuntimeSettings(): MeetingRuntimeSettings {
  if (typeof window === "undefined") {
    return DEFAULT_RUNTIME_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RUNTIME_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<MeetingRuntimeSettings>;

    return {
      providerType:
        parsed.providerType || DEFAULT_RUNTIME_SETTINGS.providerType,
      authMode: parsed.authMode || DEFAULT_RUNTIME_SETTINGS.authMode,
      baseUrl: parsed.baseUrl || DEFAULT_RUNTIME_SETTINGS.baseUrl,
      apiKey: parsed.apiKey || "",
      model: parsed.model || DEFAULT_RUNTIME_SETTINGS.model,
    };
  } catch {
    return DEFAULT_RUNTIME_SETTINGS;
  }
}

export function saveRuntimeSettings(settings: MeetingRuntimeSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
