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
    <div className="flex flex-col gap-3 rounded-[22px] border border-white/8 bg-black/10 px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
          会议模型
        </p>
        <p className="mt-1 text-sm text-white/65">
          当前使用 <span className="font-medium text-white">{currentModel.label}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 min-w-[220px] rounded-2xl border border-white/10 bg-[#0b1628] px-4 text-sm text-white outline-none transition focus:border-cyan-300/25"
        >
          {MEETING_MODEL_OPTIONS.map((model) => (
            <option key={model.id} value={model.id} className="bg-[#0a1628]">
              {model.label}
            </option>
          ))}
        </select>

        <div className="inline-flex h-11 items-center justify-center rounded-2xl border border-cyan-300/12 bg-cyan-400/8 px-4 text-xs text-cyan-100/78">
          {currentModel.provider}
        </div>
      </div>
    </div>
  );
}
