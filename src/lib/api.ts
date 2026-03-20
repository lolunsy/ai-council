import type {
  FinalDecision,
  MeetingReport,
  MeetingRoleInput,
} from "@/types/meeting";
import type { MeetingRuntimeSettings } from "@/types/settings";

export async function generateRoleReport(payload: {
  topic: string;
  role: MeetingRoleInput;
  followUp?: string;
  settings: MeetingRuntimeSettings;
}): Promise<MeetingReport> {
  const response = await fetch("/api/chat/role", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to generate role report");
  }

  return response.json();
}

export async function generateJudgeDecision(payload: {
  topic: string;
  followUp?: string;
  settings: MeetingRuntimeSettings;
  reports: Array<{
    speaker: string;
    content: string;
  }>;
}): Promise<FinalDecision> {
  const response = await fetch("/api/chat/judge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to generate final decision");
  }

  return response.json();
}
