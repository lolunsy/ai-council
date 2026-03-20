import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Deprecated route",
      detail:
        "请改用 /api/chat/role 和 /api/chat/judge。旧的 /api/chat 已停止使用。",
    },
    { status: 410 }
  );
}
