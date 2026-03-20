import { NextResponse } from "next/server";
import {
  callUpstream,
  buildRoleSystemPrompt,
  buildRoleUserPrompt,
  splitReportContent,
  buildJudgeSystemPrompt,
  buildJudgeUserPrompt,
  type RuntimeSettings,
  type RoleInput,
} from "@/lib/meeting-engine";

interface ChatRequest {
  topic: string;
  roles: RoleInput[];
  followUp?: string;
  settings?: RuntimeSettings;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { topic, roles, followUp, settings } = body;

    if (!topic || !roles || roles.length === 0) {
      return NextResponse.json(
        { error: "Missing topic or roles" },
        { status: 400 }
      );
    }

    const activeSettings: RuntimeSettings = {
      providerType: settings?.providerType || "openai_compatible",
      authMode: settings?.authMode || "bearer",
      baseUrl: settings?.baseUrl?.trim() || "",
      apiKey: settings?.apiKey?.trim() || "",
      model: settings?.model?.trim() || "openrouter/auto",
    };

    const reports = [];

    for (const role of roles) {
      const raw = await callUpstream({
        settings: activeSettings,
        messages: [
          {
            role: "system",
            content: buildRoleSystemPrompt(role),
          },
          {
            role: "user",
            content: buildRoleUserPrompt(topic, followUp),
          },
        ],
        temperature: 0.7,
      });

      const parsed = splitReportContent(raw);

      reports.push({
        id: `report-${role.id}-${Date.now()}`,
        roleId: role.id,
        speaker: role.name,
        summary: parsed.summary,
        content: parsed.content,
        reasoning: parsed.reasoning,
      });
    }

    const judgeRaw = await callUpstream({
      settings: activeSettings,
      messages: [
        {
          role: "system",
          content: buildJudgeSystemPrompt(),
        },
        {
          role: "user",
          content: buildJudgeUserPrompt(
            topic,
            reports.map((report) => ({
              speaker: report.speaker,
              content: report.content,
            })),
            followUp
          ),
        },
      ],
      temperature: 0.6,
    });

    const judgeParsed = splitReportContent(judgeRaw);

    const finalDecision = {
      speaker: "裁判长",
      summary: judgeParsed.summary,
      content: judgeParsed.content,
      reasoning: judgeParsed.reasoning,
    };

    return NextResponse.json({
      reports,
      finalDecision,
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
