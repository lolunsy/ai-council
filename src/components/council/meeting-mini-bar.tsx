"use client";

import { motion } from "framer-motion";
import { ROLE_LIBRARY } from "@/data/roles";
import { cn } from "@/lib/utils";

interface MeetingMiniBarProps {
  visible: boolean;
  statusText: string;
  visibleCount: number;
  totalCount: number;
  participantRoleIds: string[];
  activeRoleId?: string | null;
}

export function MeetingMiniBar({
  visible,
  statusText,
  visibleCount,
  totalCount,
  participantRoleIds,
  activeRoleId = null,
}: MeetingMiniBarProps) {
  const roles = participantRoleIds
    .map((roleId) => ROLE_LIBRARY.find((role) => role.id === roleId))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : -12,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.22 }}
      className="fixed left-1/2 top-4 z-[70] w-[min(920px,calc(100vw-24px))] -translate-x-1/2"
    >
      <div className="overflow-hidden rounded-2xl border border-cyan-300/14 bg-[#081527]/88 shadow-[0_12px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/[0.06] via-transparent to-cyan-300/[0.04]" />

        <div className="relative z-10 flex min-h-[58px] items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-100/80">
              Live Meeting
            </div>

            <div className="hidden h-4 w-px bg-white/10 md:block" />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {statusText}
              </p>
              <p className="mt-0.5 text-xs text-white/45">
                进度 {Math.min(visibleCount, totalCount)} / {totalCount}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {roles.map((role) => (
              <div
                key={role!.id}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-base transition-all duration-200",
                  role!.id === activeRoleId &&
                    "scale-110 border-cyan-300/30 bg-cyan-400/12 shadow-[0_0_0_1px_rgba(103,232,249,0.18)_inset,0_8px_20px_rgba(6,182,212,0.14)]"
                )}
                title={role!.name}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br opacity-70",
                    role!.color
                  )}
                />
                <span className="relative z-10">{role!.avatar}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
