import { NextResponse } from "next/server";

interface RoleInput {
  id: string;
  name: string;
  prompt: string;
}

interface ChatRequest {
  topic: string;
  roles: RoleInput[];
  model: string;
  followUp?: string;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();

    const { topic, roles, model, followUp } = body;

    if (!topic || !roles || roles.length === 0) {
      return NextResponse.json(
        { error: "Missing topic or roles" },
        { status: 400 }
      );
    }

    const reports = roles.map((role) => {
      return {
        id: `report-${role.id}`,
        roleId: role.id,
        speaker: role.name,
        summary: `这是 ${role.name} 对议题的核心判断（模拟数据）`,
        content: `
 ## 核心判断

 我是 ${role.name}。

 针对议题：

 > ${topic}

 ${
   followUp
     ? `同时考虑主持人补充信息：${followUp}`
     : ""
 }

 我给出的判断是：当前需要综合评估风险与机会。

 ## 建议

 1. 不要一次性决策
 2. 建议分阶段推进
 3. 需要更多数据支持
        `,
        reasoning: `
 ### 推演逻辑（模拟）

 - 从 ${role.name} 的角色视角出发
 - 分析议题风险与收益
 - 给出结构化建议

 （当前为假数据，用于打通前后端链路）
        `,
      };
    });

    const finalDecision = {
      speaker: "裁判长",
      summary: "综合各方观点后的最终决策（模拟）",
      content: `
 ## 最终裁决

 基于所有角色的意见，我给出如下判断：

 - 当前议题存在机会，但风险不可忽视
 - 建议采用分阶段推进策略
 - 在获取更多数据后再扩大投入

 ## 结论

 不是不做，而是要用更可控的方式做。
       `,
      reasoning: `
 ### 裁决依据

 - 各角色观点存在分歧
 - 需要在增长与风险之间取得平衡

 （当前为模拟输出）
       `,
    };

    return NextResponse.json({
      reports,
      finalDecision,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", detail: String(error) },
      { status: 500 }
    );
  }
}
