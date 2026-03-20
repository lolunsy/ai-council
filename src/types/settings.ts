export type ProviderType =
  | "openrouter"
  | "openai_compatible"
  | "custom_relay";

export type AuthMode = "bearer" | "raw";

export interface MeetingRuntimeSettings {
  providerType: ProviderType;
  authMode: AuthMode;
  baseUrl: string;
  apiKey: string;
  model: string;
}
