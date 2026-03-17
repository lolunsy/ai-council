"use client";

import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { DEFAULT_MEETING_MODEL } from "@/data/models";
import { ROLE_LIBRARY } from "@/data/roles";
import {
  createInitialSlots,
  getAssignedRoleIds,
  getRoleById,
} from "@/lib/council";
import type { MeetingRoleInput } from "@/types/meeting";
import type { MeetingSlot } from "@/types/council";
import { DraggableRoleCard } from "./draggable-role-card";
import { MeetingGrid } from "./meeting-grid";
import { RolePool } from "./role-pool";
import { TopicInput } from "./topic-input";

interface PrepHallProps {
  onStartMeeting: (input: {
    topic: string;
    roles: MeetingRoleInput[];
    model: string;
  }) => void | Promise<void>;
  isStarting?: boolean;
  errorMessage?: string;
}

export function PrepHall({
  onStartMeeting,
  isStarting = false,
  errorMessage = "",
}: PrepHallProps) {
  const [slots, setSlots] = useState<MeetingSlot[]>(createInitialSlots);
  const [topic, setTopic] = useState("");
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MEETING_MODEL);

  const assignedRoleIds = useMemo(() => getAssignedRoleIds(slots), [slots]);
  const selectedCount = assignedRoleIds.size;
  const canStart =
    !isStarting && selectedCount > 0 && topic.trim().length > 0;

  const activeRole = getRoleById(ROLE_LIBRARY, activeRoleId);

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

  function handleStart() {
    const selectedRoles = slots
      .map((slot) => getRoleById(ROLE_LIBRARY, slot.roleId))
      .filter(Boolean)
      .map((role) => ({
        id: role!.id,
        name: role!.name,
        prompt: `${role!.title}。${role!.description}`,
      }));

    onStartMeeting({
      topic: topic.trim(),
      roles: selectedRoles,
      model: selectedModel,
    });
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="pt-8 md:pt-12">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/60 backdrop-blur-md">
            AI Council / Pre-Meeting Chamber
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.05]">
            AI 议事厅
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            选择不同立场的 AI 角色加入会议，让它们围绕同一议题展开深度辩论、举证与互相拆台，
            最终由裁判长综合所有意见，输出可执行的折中方案。
          </p>

          {errorMessage ? (
            <div className="mt-5 rounded-2xl border border-rose-300/18 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-100/90">
              会议启动失败：{errorMessage}
            </div>
          ) : null}
        </div>
      </section>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <section className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <MeetingGrid
              slots={slots}
              roles={ROLE_LIBRARY}
              onRemoveRole={handleRemoveRole}
            />

            <TopicInput
              value={topic}
              onChange={setTopic}
              selectedCount={selectedCount}
              canStart={canStart}
              onStart={handleStart}
              model={selectedModel}
              onModelChange={setSelectedModel}
              isStarting={isStarting}
            />
          </div>

          <RolePool roles={ROLE_LIBRARY} assignedRoleIds={assignedRoleIds} />
        </section>

        <DragOverlay>
          {activeRole ? <DraggableRoleCard role={activeRole} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}




