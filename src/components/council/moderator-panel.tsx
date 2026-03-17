"use client";

import { useState } from "react";

interface ModeratorPanelProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ModeratorPanel({
  onSubmit,
  disabled = false,
}: ModeratorPanelProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    const message = value.trim();
    if (!message || disabled) return;
    onSubmit(message);
    setValue("");
  }

  return (
    <section className="mt-8 pb-10">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
        <div className="rounded-[22px] border border-white/8 bg-[#0a1628]/85 p-4">
          <div className="mb-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              主持人追问区
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              追加信息、提出质疑、点名追问
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              你可以在会议中途补充条件，例如预算变化、目标人群变化，
              或要求某位角色基于新信息重新评估。
            </p>
          </div>

          <div className="rounded-[20px] border border-dashed border-white/10 bg-black/10 p-4">
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="例如：补充一个前提，对方品牌最近刚经历舆情危机，请法务和品牌重新评估。"
              className="min-h-[100px] w-full resize-none bg-transparent text-sm leading-7 text-white/75 placeholder:text-white/25 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/8 pt-3">
              <p className="text-xs text-white/30">
                当前为前端假流程：发送后会插入主持人补充卡与一张裁判长回应卡
              </p>
              <button
                type="button"
                onClick={handleSend}
                disabled={disabled || value.trim().length === 0}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-cyan-300/18 bg-cyan-400/12 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30"
              >
                发送追问
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

