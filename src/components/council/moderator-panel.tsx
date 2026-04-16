"use client";

import { useState } from "react";

interface ModeratorPanelProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  statusText?: string;
}

export function ModeratorPanel({
  onSubmit,
  disabled = false,
  statusText = "",
}: ModeratorPanelProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    const message = value.trim();
    if (!message || disabled) return;
    onSubmit(message);
    setValue("");
  }

  return (
    <section className="relative rounded-[30px] border border-white/10 bg-black/72 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/65 to-transparent" />

      <div className="relative z-10 rounded-[30px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/60">
              Commander Terminal
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[0.08em] text-white">
              最高指挥官终端
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              在当前回合结束后，你可以强制追加新的条件、限制或命令，推动全体意识体进入下一轮推演。
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
            {statusText || "等待指令"}
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/8 bg-black/35 p-4">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="作为最高指挥官，输入追加条件强制介入会议..."
            className="min-h-[108px] w-full resize-none bg-transparent text-sm leading-7 text-white/80 placeholder:text-white/28 focus:outline-none"
          />

          <div className="mt-4 flex flex-col gap-3 border-t border-white/8 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-6 text-white/35">
              发送后将创建一轮新的会议推演，并把这条指令插入历史时间轴。
            </p>

            <button
              type="button"
              onClick={handleSend}
              disabled={disabled || value.trim().length === 0}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/14 px-5 text-sm font-semibold tracking-[0.12em] text-cyan-50 shadow-[0_0_32px_rgba(34,211,238,0.12)] transition hover:border-cyan-200/45 hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30 disabled:shadow-none"
            >
              [ OVERRIDE // 强制介入 ]
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
