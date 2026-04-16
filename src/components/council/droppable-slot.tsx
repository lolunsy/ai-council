"use client";

import { useDroppable } from "@dnd-kit/core";
import type { CouncilRole } from "@/types/council";
import { cn } from "@/lib/utils";
import { SelectedRoleCard } from "./selected-role-card";

interface DroppableSlotProps {
  slotId: string;
  index: number;
  role: CouncilRole | null;
  onRemove: () => void;
}

export function DroppableSlot({
  slotId,
  index,
  role,
  onRemove,
}: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
    data: {
      type: "slot",
      slotId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex w-[180px] min-h-[260px] shrink-0 items-center justify-center overflow-hidden rounded-[32px] border border-dashed p-4 backdrop-blur-xl transition-all duration-300",
        role
          ? "border-white/14 bg-white/[0.05] shadow-[0_20px_80px_rgba(0,0,0,0.22)]"
          : "border-white/12 bg-black/25",
        isOver &&
          "scale-[1.02] border-cyan-300/50 bg-cyan-400/[0.09] ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_24%,transparent_76%,rgba(34,211,238,0.12))]" />

      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/55">
        Pod {index + 1}
      </div>

      <div className="relative z-10 flex min-h-[210px] w-full items-center justify-center pt-8">
        {role ? (
          <SelectedRoleCard role={role} onRemove={onRemove} />
        ) : (
          <div className="flex min-h-[190px] flex-col items-center justify-center text-center">
            <div
              className={cn(
                "mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/12 bg-black/25 text-2xl text-white/60 transition-all duration-300",
                isOver && "border-cyan-300/35 bg-cyan-400/12 text-cyan-100"
              )}
            >
              +
            </div>
            <p
              className={cn(
                "text-sm font-medium tracking-[0.08em] transition-colors duration-300",
                isOver ? "text-cyan-100" : "text-white/72"
              )}
            >
              {isOver ? "释放角色以完成接入" : "拖入意识体"}
            </p>
            <p
              className={cn(
                "mt-2 max-w-[140px] text-xs leading-5 transition-colors duration-300",
                isOver ? "text-cyan-100/75" : "text-white/42"
              )}
            >
              {isOver
                ? "全息培养舱已锁定，等待同步。"
                : "空白底座正在等待新的参会角色。"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
