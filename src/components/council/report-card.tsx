"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ROLE_LIBRARY } from "@/data/roles";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  speaker: string;
  title: string;
  badge: string;
  summary: string;
  content: string;
  reasoning: string;
  roleId: string;
  isFinal?: boolean;
}

export function ReportCard({
  speaker,
  title,
  badge,
  summary,
  content,
  reasoning,
  roleId,
  isFinal = false,
}: ReportCardProps) {
  const [expanded, setExpanded] = useState(false);
  const role = ROLE_LIBRARY.find((item) => item.id === roleId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "relative overflow-hidden rounded-[32px] border p-6 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl",
        isFinal
          ? "border-cyan-300/20 bg-cyan-400/[0.05]"
          : "border-white/10 bg-white/[0.045]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70",
          role?.color ?? "from-white/10 to-white/0"
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
              {role?.avatar ?? "🧠"}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-white">{speaker}</h2>
                <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {badge}
                </span>
                {isFinal ? (
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-400/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-100/85">
                    Final Decision
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-sm font-medium text-white/90">{title}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
                {summary}
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mt-6 rounded-[24px] border p-5",
            isFinal
              ? "border-cyan-300/12 bg-cyan-400/[0.04]"
              : "border-white/8 bg-black/10"
          )}
        >
          <div className="prose prose-invert max-w-none prose-headings:mb-3 prose-headings:text-white prose-p:text-white/78 prose-li:text-white/75 prose-strong:text-white prose-blockquote:border-white/20 prose-blockquote:text-white/70 prose-table:block prose-table:w-full prose-table:overflow-x-auto prose-th:text-white prose-td:text-white/75">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/8 bg-black/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-white/[0.02]"
          >
            <div>
              <p className="text-sm font-medium text-white">展开查看推演过程</p>
              <p className="mt-1 text-xs text-white/45">
                查看该角色在形成结论前的分析路径
              </p>
            </div>

            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-white/60 transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </button>

          {expanded ? (
            <div className="border-t border-white/8 px-4 py-4">
              <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/75 prose-li:text-white/75 prose-strong:text-white prose-blockquote:border-white/20 prose-blockquote:text-white/70 prose-table:block prose-table:w-full prose-table:overflow-x-auto prose-th:text-white prose-td:text-white/75">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {reasoning}
                </ReactMarkdown>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
