"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { ROLE_LIBRARY } from "@/data/roles";
import { createInitialSlots, getAssignedRoleIds } from "@/lib/council";
import type { MeetingSlot } from "@/types/council";
import { MeetingGrid } from "./meeting-grid";
import { RolePool } from "./role-pool";
import { TopicInput } from "./topic-input";

export function PrepHall() {
  const [slots, setSlots] = useState<MeetingSlot[]>(createInitialSlots);
  const [topic, setTopic] = useState("");

  const assignedRoleIds = useMemo(() => getAssignedRoleIds(slots), [slots]);
  const selectedCount = assignedRoleIds.size;
  const canStart = selectedCount > 0 && topic.trim().length > 0;

  function handleDragEnd(event: DragEndEvent) {
    const roleId = event.active.data.current?.roleId as string | undefined;
    const slotId = event.over?.id as string | undefined;

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
        </div>
      </section>

      <DndContext onDragEnd={handleDragEnd}>
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
            />
          </div>

          <RolePool roles={ROLE_LIBRARY} assignedRoleIds={assignedRoleIds} />
        </section>
      </DndContext>
    </main>
  );
}
