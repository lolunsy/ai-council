import type { CouncilRole, MeetingSlot } from "@/types/council";
import { getRoleById } from "@/lib/council";
import { DroppableSlot } from "./droppable-slot";

interface MeetingGridProps {
  slots: MeetingSlot[];
  roles: CouncilRole[];
  onRemoveRole: (slotId: string) => void;
}

export function MeetingGrid({
  slots,
  roles,
  onRemoveRole,
}: MeetingGridProps) {
  return (
    <div className="w-full max-w-6xl rounded-[36px] border border-white/10 bg-black/20 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/55">
            Holographic Base Array
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-[0.08em] text-white md:text-3xl">
            全息底座阵列
          </h2>
          <p className="mt-2 text-sm leading-7 text-white/50 md:text-base">
            将角色拖入下方培养舱席位，系统会按你的编排构建本轮议事阵型。
          </p>
        </div>

        <div className="rounded-full border border-cyan-500/15 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-100/75">
          Max 4 Synced Delegates
        </div>
      </div>

      <div className="mt-8 overflow-x-auto pb-4">
        <div className="flex min-w-max flex-row justify-center gap-6">
          {slots.map((slot, index) => (
            <DroppableSlot
              key={slot.id}
              slotId={slot.id}
              index={index}
              role={getRoleById(roles, slot.roleId)}
              onRemove={() => onRemoveRole(slot.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
