"use client";

import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { ROLE_LIBRARY } from "@/data/roles";
import {
  createInitialSlots,
  getAssignedRoleIds,
  getRoleById,
} from "@/lib/council";
import type { CouncilRole, MeetingSlot } from "@/types/council";
import type { MeetingRoleInput } from "@/types/meeting";
import { type CreateRoleInput } from "./create-role-modal";
import { DraggableRoleCard } from "./draggable-role-card";
import { MeetingGrid } from "./meeting-grid";
import { RolePool } from "./role-pool";
import { TopicInput } from "./topic-input";

interface PrepHallProps {
  onStartMeeting: (input: {
    topic: string;
    roles: MeetingRoleInput[];
    roleProfiles: CouncilRole[];
  }) => void | Promise<void>;
  isStarting?: boolean;
  errorMessage?: string;
}

const CUSTOM_ROLE_PALETTES = [
  "from-cyan-500/24 via-sky-400/10 to-transparent",
  "from-amber-500/24 via-orange-400/10 to-transparent",
  "from-fuchsia-500/22 via-violet-400/10 to-transparent",
  "from-emerald-500/24 via-teal-400/10 to-transparent",
];

export function PrepHall({
  onStartMeeting,
  isStarting = false,
  errorMessage = "",
}: PrepHallProps) {
  const [slots, setSlots] = useState<MeetingSlot[]>(createInitialSlots);
  const [topic, setTopic] = useState("");
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [customRoles, setCustomRoles] = useState<CouncilRole[]>([]);

  const allRoles = useMemo(
    () => [...ROLE_LIBRARY, ...customRoles],
    [customRoles]
  );
  const assignedRoleIds = useMemo(() => getAssignedRoleIds(slots), [slots]);
  const selectedCount = assignedRoleIds.size;
  const canStart =
    !isStarting && selectedCount > 0 && topic.trim().length > 0;

  const activeRole = getRoleById(allRoles, activeRoleId);

  function handleDragStart(event: DragStartEvent) {
    const roleId = event.active.data.current?.roleId as string | undefined;
    setActiveRoleId(roleId ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const roleId = event.active.data.current?.roleId as string | undefined;
    const slotId = event.over?.id as string | undefined;

    setActiveRoleId(null);

    if (!roleId || !slotId) return;
    if (assignedRoleIds.has(roleId)) return;

    setSlots((currentSlots) =>
      currentSlots.map((slot) =>
        slot.id === slotId ? { ...slot, roleId } : slot
      )
    );
  }

  function handleRemoveRole(slotId: string) {
    setSlots((currentSlots) =>
      currentSlots.map((slot) =>
        slot.id === slotId ? { ...slot, roleId: null } : slot
      )
    );
  }

  function handleCreateRole(input: CreateRoleInput) {
    setCustomRoles((currentRoles) => {
      const palette =
        CUSTOM_ROLE_PALETTES[currentRoles.length % CUSTOM_ROLE_PALETTES.length];

      const nextRole: CouncilRole = {
        id: `custom-${Date.now()}-${currentRoles.length}`,
        name: input.name,
        title: "用户构建意识体",
        bias: "custom",
        description: input.prompt,
        avatar: input.avatar,
        color: palette,
        prompt: input.prompt,
      };

      return [...currentRoles, nextRole];
    });
  }

  function handleStart() {
    const selectedRoleProfiles = slots
      .map((slot) => getRoleById(allRoles, slot.roleId))
      .filter((role): role is CouncilRole => Boolean(role));

    const selectedRoles = selectedRoleProfiles.map((role) => ({
      id: role.id,
      name: role.name,
      prompt: role.prompt ?? `${role.title}。${role.description}`,
    }));

    onStartMeeting({
      topic: topic.trim(),
      roles: selectedRoles,
      roleProfiles: selectedRoleProfiles,
    });
  }

  return (
    <main className="relative flex flex-col items-center pt-10 pb-[360px] min-h-screen overflow-x-hidden">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-10 items-center">
          <MeetingGrid
            slots={slots}
            roles={allRoles}
            onRemoveRole={handleRemoveRole}
          />

          <TopicInput
            value={topic}
            onChange={setTopic}
            selectedCount={selectedCount}
            canStart={canStart}
            onStart={handleStart}
            isStarting={isStarting}
          />

          {errorMessage ? (
            <div className="w-full max-w-3xl rounded-2xl border border-rose-400/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-100/90 backdrop-blur-xl">
              议事厅初始化失败：{errorMessage}
            </div>
          ) : null}
        </div>

        <RolePool
          roles={allRoles}
          assignedRoleIds={assignedRoleIds}
          onCreateRole={handleCreateRole}
        />

        <DragOverlay>
          {activeRole ? <DraggableRoleCard role={activeRole} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}
