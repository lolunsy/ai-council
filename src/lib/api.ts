import type {
MeetingApiResponse,
StartMeetingPayload,
} from "@/types/meeting";
export async function startMeetingRequest(
payload: StartMeetingPayload
): Promise<MeetingApiResponse> {
const response = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(payload),
});
if (!response.ok) {
const text = await response.text();
throw new Error(text || "Failed to start meeting");
}
return response.json();
}
