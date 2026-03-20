"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { MeetingRuntimeSettings } from "@/types/settings";

interface SettingsModalProps {
  open: boolean;
  initialSettings: MeetingRuntimeSettings;
  onClose: () => void;
  onSave: (settings: MeetingRuntimeSettings) => void;
}

export function SettingsModal({
  open,
  initialSettings,
  onClose,
  onSave,
}: SettingsModalProps) {
  const [baseUrl, setBaseUrl] = useState(initialSettings.baseUrl);
  const [apiKey, setApiKey] = useState(initialSettings.apiKey);
  const [model, setModel] = useState(initialSettings.model);

  function handleSave() {
    onSave({
      baseUrl: baseUrl.trim() || initialSettings.baseUrl,
      apiKey: apiKey.trim(),
      model: model.trim() || initialSettings.model,
    });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0a1628]/85 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">会议设置</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/72 transition hover:border-white/18 hover:bg-white/8 hover:text-white"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/72">
              API 基础地址
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://openrouter.ai/api/v1/chat/completions"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/72">
              API 密钥
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-300"
            />
            <p className="text-xs text-white/45">
              留空将使用环境变量中的 API 密钥（服务端）
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/72">
              模型名称
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="openrouter/auto"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-300"
            />
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/72 transition hover:border-white/18 hover:bg-white/8 hover:text-white"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-2xl border border-cyan-300/20 bg-cyan-400/15 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}