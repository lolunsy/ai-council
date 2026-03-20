import { NextResponse } from "next/server";
import {
  buildJudgeSystemPrompt,
  buildJudgeUserPrompt,
  callUpstream,
  splitReportContent,
  type RuntimeSettings,
} from "@/lib/meeting-engine";

interface JudgeRequest {
  topic: string;
  followUp?: string;
  settings: RuntimeSettings;
  reports: Array<{
    speaker: string;
    content: string;
  }>;
}

export async function POST(req: Request) {
  try {
    const body: JudgeRequest = await req.json();
    const { topic, followUp, settings, reports } = body;

    if (!topic || !settings || !reports?.length) {
      return NextResponse.json(
        { error: "Missing topic, settings or reports" },
        { status: 400 }
      );
    }

    const raw = await callUpstream({
      settings,
      messages: [
        { role: "system", content: buildJudgeSystemPrompt() },
        {
          role: "user",
          content: buildJudgeUserPrompt(topic, reports, followUp),
        },
      ],
      temperature: 0.6,
    });

    const parsed = splitReportContent(raw);

    return NextResponse.json({
      speaker: "裁判长",
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
