import { NextResponse } from "next/server";

interface RoleInput {
  id: string;
  name: string;
  prompt: string;
}

interface RuntimeSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface ChatRequest {
  topic: string;
  roles: RoleInput[];
  followUp?: string;
  settings?: RuntimeSettings;
}

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callOpenRouter(options: {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
}) {
  if (!options.apiKey) {
    throw new Error("缺少 API Key，请先在右上角会议设置中填写。");
  }

  const response = await fetch(options.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.apiKey}`,
      "HTTP-Referer": "https://ai-council-03sb.onrender.com",
      "X-OpenRouter-Title": "AI Council",
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`上游模型请求失败 ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "";
}

function buildRoleSystemPrompt(role: RoleInput) {
  return `
你正在参加一个企业决策会议。

你的角色名称：${role.name}
你的角色设定：${role.prompt}

请始终站在该角色立场发言，不要中立，不要模糊。
输出必须使用中文 Markdown。
请严格按以下结构输出：

## 核心判断
先给出结论。

## 建议
给出结构化建议，使用列表。

## 风险与补充说明
说明你最担心的点。

## 推演过程
写出你形成判断的分析路径，便于后续折叠展示。
`.trim();
}

function buildRoleUserPrompt(topic: string, followUp?: string) {
  return `
当前议题：
${topic}

${followUp ? `主持人补充信息：\n${followUp}\n` : ""}

请围绕当前议题给出完整判断。
`.trim();
}

function splitReportContent(raw: string) {
  const reasoningMarker = "## 推演过程";
  const markerIndex = raw.indexOf(reasoningMarker);

  if (markerIndex === -1) {
    return {
      summary: raw.slice(0, 120).trim() || "暂无摘要",
      content: raw,
      reasoning: "## 推演过程\n暂无单独推演内容。",
    };
  }

  const content = raw.slice(0, markerIndex).trim();
  const reasoning = raw.slice(markerIndex).trim();

  const summarySource = content
    .replace(/[#>*`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    summary: summarySource.slice(0, 100) || "暂无摘要",
    content,
    reasoning,
  };
}

function buildJudgeSystemPrompt() {
  return `
你是这场会议的裁判长。
你需要阅读所有角色观点，做出折中、清晰、可执行的最终裁决。

输出必须使用中文 Markdown。
请严格按以下结构输出：

## 最终裁决
先给出拍板结论。

## 最终方案
用列表给出执行方案。

## 为什么这样定
解释裁决逻辑。

## 推演过程
简要说明你如何平衡各方意见。
`.trim();
}

function buildJudgeUserPrompt(
  topic: string,
  reports: Array<{
    speaker: string;
    content: string;
  }>,
  followUp?: string
) {
  return `
当前议题：
${topic}

${followUp ? `主持人补充信息：\n${followUp}\n` : ""}

以下是各角色发言：

${reports
  .map(
    (report, index) => `
### 角色 ${index + 1}：${report.speaker}
${report.content}
`
  )
  .join("\n" )}

请综合所有观点给出最终裁决。
`.trim();
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

    const activeBaseUrl =
      settings?.baseUrl?.trim() ||
      "https://openrouter.ai/api/v1/chat/completions";

    const activeApiKey = settings?.apiKey?.trim() || "";
    const activeModel = settings?.model?.trim() || "openrouter/auto";

    const reports = [];

    for (const role of roles) {
      const raw = await callOpenRouter({
        baseUrl: activeBaseUrl,
        apiKey: activeApiKey,
        model: activeModel,
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

    const judgeRaw = await callOpenRouter({
      baseUrl: activeBaseUrl,
      apiKey: activeApiKey,
      model: activeModel,
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
