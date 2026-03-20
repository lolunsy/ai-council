import { NextResponse } from "next/server";
import {
  buildRoleSystemPrompt,
  buildRoleUserPrompt,
  callUpstream,
  splitReportContent,
  type RoleInput,
  type RuntimeSettings,
} from "@/lib/meeting-engine";

interface RoleRequest {
  topic: string;
  role: RoleInput;
  followUp?: string;
  settings: RuntimeSettings;
}

export async function POST(req: Request) {
  try {
    const body: RoleRequest = await req.json();
    const { topic, role, followUp, settings } = body;

    if (!topic || !role || !settings) {
      return NextResponse.json(
        { error: "Missing topic, role or settings" },
        { status: 400 }
      );
    }

    const raw = await callUpstream({
      settings,
      messages: [
        { role: "system", content: buildRoleSystemPrompt(role) },
        { role: "user", content: buildRoleUserPrompt(topic, followUp) },
      ],
      temperature: 0.7,
    });

    const parsed = splitReportContent(raw);

    return NextResponse.json({
      id: `report-${role.id}-${Date.now()}`,
      roleId: role.id,
      speaker: role.name,
      summary: parsed.summary,
      content: parsed.content,
      reasoning: parsed.reasoning,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
