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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">会议坑位</h2>
          <p className="mt-1 text-sm text-white/45">
            当前支持从角色库拖入坑位，也支持从坑位中移除角色
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
          最多 4 位参会角色
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
  );
}
