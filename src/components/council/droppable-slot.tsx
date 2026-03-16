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
        "relative min-h-[168px] rounded-3xl border border-dashed p-4 backdrop-blur-md transition-all duration-200",
        role
          ? "border-white/14 bg-white/[0.045] shadow-[0_16px_50px_rgba(0,0,0,0.18)]"
          : "border-white/12 bg-white/[0.025]",
        isOver &&
          "scale-[1.01] border-cyan-300/45 bg-cyan-400/[0.08] shadow-[0_0_0_1px_rgba(103,232,249,0.22)_inset,0_16px_60px_rgba(6,182,212,0.12)]"
      )}
    >
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
        Seat {index + 1}
      </div>

      <div className="pt-9">
        {role ? (
          <SelectedRoleCard role={role} onRemove={onRemove} />
        ) : (
          <div className="flex min-h-[102px] flex-col items-center justify-center rounded-[24px] border border-transparent text-center transition-all duration-200">
            <div
              className={cn(
                "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-lg text-white/60 transition-all duration-200",
                isOver && "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
              )}
            >
              +
            </div>
            <p
              className={cn(
                "text-sm transition-colors duration-200",
                isOver ? "text-cyan-100" : "text-white/70"
              )}
            >
              {isOver ? "松手即可加入会议" : "拖入参会角色"}
            </p>
            <p
              className={cn(
                "mt-1 text-xs transition-colors duration-200",
                isOver ? "text-cyan-100/70" : "text-white/40"
              )}
            >
              {isOver ? "当前坑位已准备接收角色" : "准备进入 AI 议事厅"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

