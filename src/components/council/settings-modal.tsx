"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { DEFAULT_RUNTIME_SETTINGS } from "@/lib/settings";
import type {
  AuthMode,
  MeetingRuntimeSettings,
  ProviderType,
} from "@/types/settings";

interface SettingsModalProps {
  open: boolean;
  initialSettings: MeetingRuntimeSettings;
  onClose: () => void;
  onSave: (settings: MeetingRuntimeSettings) => void;
}

function getProviderHint(providerType: ProviderType) {
  if (providerType === "openrouter") {
    return "OpenRouter 可只填域名，系统会自动补成 /api/v1/chat/completions";
  }

  if (providerType === "openai_compatible") {
    return "OpenAI Compatible 可只填域名，系统会自动补成 /v1/chat/completions";
  }

  return "Custom Relay 将尽量保留你的原始地址，仅在明显缺失时做轻量补全。";
}

export function SettingsModal({
  open,
  initialSettings,
  onClose,
  onSave,
}: SettingsModalProps) {
  const [form, setForm] = useState<MeetingRuntimeSettings>(initialSettings);

  useEffect(() => {
    setForm(initialSettings);
  }, [initialSettings]);

  if (!open) return null;

  function updateField<K extends keyof MeetingRuntimeSettings>(
    key: K,
    value: MeetingRuntimeSettings[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleProviderChange(providerType: ProviderType) {
    setForm((current) => {
      if (providerType === "openrouter") {
        return {
          ...current,
          providerType,
          authMode: "bearer",
          baseUrl: current.baseUrl.trim() || DEFAULT_RUNTIME_SETTINGS.baseUrl,
          model: current.model.trim() || "openrouter/auto",
        };
      }

      if (providerType === "openai_compatible") {
        return {
          ...current,
          providerType,
          authMode: current.authMode || "bearer",
        };
      }

      return {
        ...current,
        providerType,
      };
    });
  }

  function handleSave() {
    onSave({
      providerType: form.providerType || DEFAULT_RUNTIME_SETTINGS.providerType,
      authMode: form.authMode || DEFAULT_RUNTIME_SETTINGS.authMode,
      baseUrl: form.baseUrl.trim() || DEFAULT_RUNTIME_SETTINGS.baseUrl,
      apiKey: form.apiKey.trim(),
      model: form.model.trim() || DEFAULT_RUNTIME_SETTINGS.model,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#030712]/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[#081321]/95 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
              Global Settings
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              会议设置
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              使用你自己的聚合 API 配置。当前仅保存在本地浏览器，不上传到云端。
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/65 transition hover:border-white/18 hover:bg-white/8 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/88">
                接入类型
              </label>
              <select
                value={form.providerType}
                onChange={(event) =>
                  handleProviderChange(event.target.value as ProviderType)
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-cyan-300/25"
              >
                <option value="openrouter" className="bg-[#0a1628]">
                  OpenRouter
                </option>
                <option value="openai_compatible" className="bg-[#0a1628]">
                  OpenAI Compatible
                </option>
                <option value="custom_relay" className="bg-[#0a1628]">
                  Custom Relay
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/88">
                认证方式
              </label>
              <select
                value={form.authMode}
                onChange={(event) =>
                  updateField("authMode", event.target.value as AuthMode)
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-cyan-300/25"
              >
                <option value="bearer" className="bg-[#0a1628]">
                  Bearer Token
                </option>
                <option value="raw" className="bg-[#0a1628]">
                  Raw Key
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/88">
              API Base URL
            </label>
            <input
              value={form.baseUrl}
              onChange={(event) => updateField("baseUrl", event.target.value)}
              placeholder="例如： `https://cli.lxjjdj.fun` "
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-cyan-300/25"
            />
            <p className="text-xs leading-5 text-white/38">
              {getProviderHint(form.providerType)}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/88">
              API Key
            </label>
            <input
              value={form.apiKey}
              onChange={(event) => updateField("apiKey", event.target.value)}
              type="password"
              placeholder="输入你自己的第三方 API Key"
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-cyan-300/25"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/88">
              Model
            </label>
            <input
              value={form.model}
              onChange={(event) => updateField("model", event.target.value)}
              placeholder="例如：glm-4-flash / openrouter/auto"
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-cyan-300/25"
            />
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
            <p className="text-xs leading-6 text-white/42">
              推荐流程：先选择接入类型，再填写域名、Key 和模型。系统会按类型自动补全接口路径，并按认证方式拼接请求头。
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/8 px-6 py-5">
          <p className="text-xs text-white/32">
            当前配置仅保存在本地浏览器，不进入公开项目的服务器环境变量。
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white/72 transition hover:border-white/18 hover:bg-white/8 hover:text-white"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-cyan-300/18 bg-cyan-400/12 px-5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/18"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}