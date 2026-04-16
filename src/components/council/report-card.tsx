"use client";

import { ChevronRight, Crown, Radio, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import type { CouncilRole } from "@/types/council";
import { cn } from "@/lib/utils";

type ReportCardKind = "report" | "decision" | "note";

interface ReportCardProps {
  speaker: string;
  summary: string;
  badge: string;
  role: CouncilRole;
  kind?: ReportCardKind;
  isActive?: boolean;
  isLive?: boolean;
  onSelect: () => void;
}

function renderKindIcon(kind: ReportCardKind) {
  if (kind === "decision") return <Crown className="h-3.5 w-3.5" />;
  if (kind === "note") return <ShieldAlert className="h-3.5 w-3.5" />;
  return <Radio className="h-3.5 w-3.5" />;
}

export function ReportCard({
  speaker,
  summary,
  badge,
  role,
  kind = "report",
  isActive = false,
  isLive = false,
  onSelect,
}: ReportCardProps) {
  const toneClass =
    kind === "decision"
      ? "border-cyan-300/18 bg-cyan-400/[0.08]"
      : kind === "note"
        ? "border-amber-300/18 bg-amber-400/[0.07]"
        : "border-white/10 bg-white/[0.04]";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-[26px] border p-4 text-left shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300",
        toneClass,
        isActive &&
          "ring-1 ring-cyan-300/55 shadow-[0_0_0_1px_rgba(103,232,249,0.18)_inset,0_0_32px_rgba(34,211,238,0.16)]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-75",
          role.color
        )}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-xl shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
            {role.avatar}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {speaker}
                </p>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {renderKindIcon(kind)}
                  {badge}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLive ? (
                  <span className="inline-flex items-center rounded-full border border-cyan-300/18 bg-cyan-400/12 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-cyan-100/80">
                    LIVE
                  </span>
                ) : null}
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 text-white/35 transition-transform duration-300",
                    isActive
                      ? "translate-x-0.5 text-cyan-100/85"
                      : "group-hover:translate-x-0.5 group-hover:text-white/60"
                  )}
                />
              </div>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/68">
              {summary}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
