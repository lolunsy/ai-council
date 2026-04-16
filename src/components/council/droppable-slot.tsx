"use client";

import { useDroppable } from "@dnd-kit/core";
import type { CouncilRole } from "@/types/council";
import { cn } from "@/lib/utils";

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
        "w-[160px] h-[240px] shrink-0 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden",
        role
          ? "border-solid border-cyan-500/40 bg-cyan-950/20"
          : "border-dashed border-cyan-500/30 bg-cyan-900/10 hover:bg-cyan-900/20",
        isOver &&
          "border-solid border-cyan-400 bg-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.3)] scale-105"
      )}
    >
      <div className="absolute left-3 top-3 rounded-full border border-cyan-500/20 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-400/60">
        Seat {index + 1}
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center p-3 pt-10">
        {role ? (
          <div className="flex h-full w-full flex-col items-center justify-between rounded-xl border border-cyan-400/20 bg-black/30 p-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-950/30 text-2xl">
              {role.avatar}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">{role.name}</p>
              <p className="line-clamp-2 text-xs leading-5 text-white/65">
                {role.title}
              </p>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="rounded-full border border-cyan-400/20 bg-cyan-950/30 px-3 py-1 text-xs text-cyan-100/80 transition hover:bg-cyan-900/40"
            >
              移除
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl text-cyan-400/60">+</div>
            <p className="mt-4 text-sm text-cyan-400/60">
              {isOver ? "释放角色" : "拖入角色"}
            </p>
            <p className="mt-2 text-xs text-cyan-400/60">全息底座待命中</p>
          </div>
        )}
      </div>
    </div>
  );
}
