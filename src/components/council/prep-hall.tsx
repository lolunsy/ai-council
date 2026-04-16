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
import { CreateRoleInput } from "./create-role-modal";
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
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#030711] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.12),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
        <div className="absolute left-1/2 top-[18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/6 blur-3xl" />
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="relative z-10 flex flex-1 flex-col px-4 pb-[22rem] pt-6 sm:px-6 lg:px-10 lg:pb-[24rem]">
          <section className="mx-auto w-full max-w-6xl">
            <TopicInput
              value={topic}
              onChange={setTopic}
              selectedCount={selectedCount}
              canStart={canStart}
              onStart={handleStart}
              isStarting={isStarting}
            />

            {errorMessage ? (
              <div className="mt-4 rounded-[24px] border border-rose-400/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-100/90 shadow-[0_0_30px_rgba(244,63,94,0.08)] backdrop-blur-xl">
                议事厅初始化失败：{errorMessage}
              </div>
            ) : null}
          </section>

          <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-10 md:py-14">
            <MeetingGrid
              slots={slots}
              roles={allRoles}
              onRemoveRole={handleRemoveRole}
            />
          </section>
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
