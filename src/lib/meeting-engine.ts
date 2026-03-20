type ProviderType = "openrouter" | "openai_compatible" | "custom_relay";
type AuthMode = "bearer" | "raw";

export interface RuntimeSettings {
  providerType: ProviderType;
  authMode: AuthMode;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface RoleInput {
  id: string;
  name: string;
  prompt: string;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function normalizeProviderUrl(providerType: ProviderType, rawUrl?: string) {
  const input = (rawUrl || "").trim();
  const cleaned = input.replace(/\/+$/, "");

  if (!cleaned) {
    if (providerType === "openrouter") {
      return " `https://openrouter.ai/api/v1/chat/completions` ";
    }
    return "";
  }

  if (providerType === "openrouter") {
    if (
      cleaned === " `https://openrouter.ai` " ||
      cleaned === " `https://openrouter.ai/api/v1` " ||
      cleaned === " `https://openrouter.ai/api/v1/chat/completions` "
    ) {
      return " `https://openrouter.ai/api/v1/chat/completions` ";
    }

    if (cleaned.endsWith("/chat/completions")) return cleaned;
    if (cleaned.endsWith("/api/v1") || cleaned.endsWith("/v1")) {
      return `${cleaned}/chat/completions`;
    }
    return `${cleaned}/api/v1/chat/completions`;
  }

  if (cleaned.endsWith("/chat/completions")) return cleaned;
  if (cleaned.endsWith("/api/v1") || cleaned.endsWith("/v1")) {
    return `${cleaned}/chat/completions`;
  }
  return `${cleaned}/v1/chat/completions`;
}

export function buildAuthHeaders(authMode: AuthMode, apiKey: string) {
  if (!apiKey) {
    throw new Error("缺少 API Key，请先在右上角会议设置中填写。");
  }

  if (authMode === "raw") {
    return { Authorization: apiKey };
  }

  return { Authorization: `Bearer ${apiKey}` };
}

export async function callUpstream(options: {
  settings: RuntimeSettings;
  messages: ChatMessage[];
  temperature?: number;
}) {
  const resolvedUrl = normalizeProviderUrl(
    options.settings.providerType,
    options.settings.baseUrl
  );

  if (!resolvedUrl) {
    throw new Error("缺少有效的 API 地址，请先在会议设置中填写。");
  }

  const authHeaders = buildAuthHeaders(
    options.settings.authMode,
    options.settings.apiKey
  );

  const response = await fetch(resolvedUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      "HTTP-Referer": " `https://ai-council-03sb.onrender.com` ",
      "X-OpenRouter-Title": "AI Council",
    },
    body: JSON.stringify({
      model: options.settings.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
    }),
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(
      `上游模型请求失败 ${response.status} | URL: ${resolvedUrl} | ${rawText.slice(0, 300)}`
    );
  }

  let data: any;

  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `上游返回了非 JSON 内容 | URL: ${resolvedUrl} | ${rawText.slice(0, 300)}`
    );
  }

  return data?.choices?.[0]?.message?.content || "";
}

export function splitReportContent(raw: string) {
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
  const summarySource = content.replace(/[#>*`-]/g, " ").replace(/\s+/g, " ").trim();

  return {
    summary: summarySource.slice(0, 100) || "暂无摘要",
    content,
    reasoning,
  };
}

export function buildRoleSystemPrompt(role: RoleInput) {
  return `
你正在参加一个企业决策会议。

你的角色名称：${role.name}
你的角色设定：${role.prompt}

请始终站在该角色立场发言，不要中立，不要模糊。
必须给出明确分析理由，而不是空泛表态。
输出必须使用中文 Markdown。
请严格按以下结构输出：

## 核心判断
先给出明确结论。

## 关键分析理由
至少给出 3 条具体理由，每条都要解释为什么。

## 建议
给出结构化建议，使用列表。

## 风险与补充说明
说明你最担心的点。

## 推演过程
写出你形成判断的分析路径，不能只重复结论。
`.trim();
}

export function buildRoleUserPrompt(topic: string, followUp?: string) {
  return `
当前议题：
${topic}

${followUp ? `主持人补充信息：\n${followUp}\n` : ""}

请围绕当前议题给出完整判断。
`.trim();
}

export function buildJudgeSystemPrompt() {
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
解释裁决逻辑，必须明确引用不同角色的观点差异。

## 推演过程
简要说明你如何平衡各方意见。
`.trim();
}

export function buildJudgeUserPrompt(
  topic: string,
  reports: Array<{ speaker: string; content: string }>,
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
  .join("\n")}

请综合所有观点给出最终裁决。
`.trim();
}