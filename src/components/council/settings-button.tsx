"use client";

import { Settings2 } from "lucide-react";

interface SettingsButtonProps {
  onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/72 backdrop-blur-md transition hover:border-white/18 hover:bg-white/8 hover:text-white"
      aria-label="打开会议设置"
      title="会议设置"
    >
      <Settings2 className="h-4 w-4" />
    </button>
  );
}
