"use client";

import { MEETING_MODEL_OPTIONS } from "@/data/models";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const currentModel =
    MEETING_MODEL_OPTIONS.find((item) => item.id === value) ??
    MEETING_MODEL_OPTIONS[0];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <div className="rounded-[22px] border border-white/8 bg-[#0a1628]/85 p-4">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              会议模型
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              选择本轮会议使用的大模型
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              当前先做模型选择与请求透传，下一步接入真实聚合 API。
            </p>
          </div>

          <div className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100/80">
            {currentModel.provider}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,240px)_1fr] md:items-start">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-cyan-300/25"
          >
            {MEETING_MODEL_OPTIONS.map((model) => (
              <option key={model.id} value={model.id} className="bg-[#0a1628]">
                {model.label}
              </option>
            ))}
          </select>

          <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
            <p className="text-sm font-medium text-white">{currentModel.label}</p>
            <p className="mt-2 text-sm leading-6 text-white/58">
              {currentModel.description}
            </p>
            <p className="mt-3 text-xs text-white/32">
              Model ID: {currentModel.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
