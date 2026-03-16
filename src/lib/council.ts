import type { CouncilRole, MeetingSlot } from "@/types/council";

export function createInitialSlots(): MeetingSlot[] {
  return [
    { id: "slot-1", roleId: null },
    { id: "slot-2", roleId: null },
    { id: "slot-3", roleId: null },
    { id: "slot-4", roleId: null },
  ];
}

export function getRoleById(roles: CouncilRole[], roleId: string | null) {
  if (!roleId) return null;
  return roles.find((role) => role.id === roleId) ?? null;
}

export function getAssignedRoleIds(slots: MeetingSlot[]) {
  return new Set(
    slots
      .map((slot) => slot.roleId)
      .filter((roleId): roleId is string => Boolean(roleId))
  );
}
