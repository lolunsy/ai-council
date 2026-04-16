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
    <div className="flex flex-row justify-center items-center gap-6 w-full">
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
  );
}
