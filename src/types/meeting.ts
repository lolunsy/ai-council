export interface MeetingRoleInput {
  id: string;
  name: string;
  prompt: string;
}

export interface MeetingReport {
  id: string;
  roleId: string;
  speaker: string;
  summary: string;
  content: string;
  reasoning: string;
}

export interface FinalDecision {
  speaker: string;
  summary: string;
  content: string;
  reasoning: string;
}

export interface MeetingApiResponse {
  reports: MeetingReport[];
  finalDecision: FinalDecision;
}

export interface StartMeetingPayload {
  topic: string;
  roles: MeetingRoleInput[];
  followUp?: string;
}
