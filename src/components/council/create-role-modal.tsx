"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export interface CreateRoleInput {
  name: string;
  avatar: string;
  prompt: string;
}

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateRoleInput) => void;
}

const INITIAL_FORM: CreateRoleInput = {
  name: "",
  avatar: "🧠",
  prompt: "",
};

export function CreateRoleModal({
  open,
  onClose,
  onSave,
}: CreateRoleModalProps) {
  const [form, setForm] = useState<CreateRoleInput>(INITIAL_FORM);

  useEffect(() => {
    if (!open) return;
    setForm(INITIAL_FORM);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const canSave =
    form.name.trim().length > 0 &&
    form.avatar.trim().length > 0 &&
    form.prompt.trim().length > 0;

  function updateField<K extends keyof CreateRoleInput>(
    field: K,
    value: CreateRoleInput[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) return;

    onSave({
      name: form.name.trim(),
      avatar: form.avatar.trim(),
      prompt: form.prompt.trim(),
    });
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/72 px-4 py-8 backdrop-blur-3xl"
        >
          <button
            type="button"
            aria-label="关闭创建角色窗口"
            onClick={onClose}
            className="absolute inset-0 cursor-default"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-cyan-400/20 bg-[#040b16]/90 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),linear-gradient(160deg,rgba(15,23,42,0.88),rgba(2,6,23,0.96))]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

            <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Consciousness Forge
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-[0.08em] text-white">
                  构建新意识体终端
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  输入角色人格、头像与立场设定，这个新意识体会立刻并入当前议事厅手牌区。
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/45">
                    角色名称
                  </span>
                  <input
                    autoFocus
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="例如：并购战神 / 增长判官"
                    className="h-14 w-full rounded-[20px] border border-white/10 bg-black/25 px-4 text-base text-white placeholder:text-white/30 outline-none transition focus:border-cyan-300/35 focus:bg-black/35"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Emoji 头像
                  </span>
                  <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-black/25 px-4">
                    <input
                      value={form.avatar}
                      onChange={(event) =>
                        updateField("avatar", event.target.value)
                      }
                      placeholder="🧠"
                      className="h-14 w-full bg-transparent text-2xl text-white placeholder:text-white/30 outline-none"
                    />
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-xl">
                      {form.avatar.trim() || "🧠"}
                    </div>
                  </div>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.24em] text-white/45">
                  立场设定 Prompt
                </span>
                <textarea
                  value={form.prompt}
                  onChange={(event) => updateField("prompt", event.target.value)}
                  placeholder="描述这个意识体的立场、偏见、目标和发言风格，例如：你是一个极端激进的增长派投资人，优先追求用户规模与话题爆发，不接受温吞妥协。"
                  className="min-h-[220px] w-full resize-none rounded-[24px] border border-white/10 bg-black/25 px-4 py-4 text-base leading-8 text-white placeholder:text-white/30 outline-none transition focus:border-cyan-300/35 focus:bg-black/35"
                />
              </label>

              <div className="flex flex-col gap-3 border-t border-white/8 pt-5 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-white/50">
                  保存后将直接加入当前 DnD 角色池，并归档到“自定义”分类中。
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!canSave}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-6 text-sm font-semibold tracking-[0.12em] text-cyan-50 shadow-[0_0_36px_rgba(34,211,238,0.18)] transition hover:border-cyan-200/50 hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/35 disabled:shadow-none"
                  >
                    [ SAVE ENTITY // 注入角色 ]
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
