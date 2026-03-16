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
        "relative min-h-[152px] rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-200",
        isOver && "border-cyan-300/40 bg-cyan-400/[0.06] shadow-[0_0_0_1px_rgba(103,232,249,0.18)_inset]"
      )}
    >
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
        Seat {index + 1}
      </div>

      <div className="pt-9">
        {role ? (
          <SelectedRoleCard role={role} onRemove={onRemove} />
        ) : (
          <div className="flex min-h-[92px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-lg text-white/60">
              +
            </div>
            <p className="text-sm text-white/70">拖入参会角色</p>
            <p className="mt-1 text-xs text-white/40">准备进入 AI 议事厅</p>
          </div>
        )}
      </div>
    </div>
  );
}
