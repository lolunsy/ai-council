"use client";

import { useMemo, useState } from "react";
import type { CouncilRole } from "@/types/council";
import { cn } from "@/lib/utils";
import {
  CreateRoleModal,
  type CreateRoleInput,
} from "./create-role-modal";
import { DraggableRoleCard } from "./draggable-role-card";

type RolePoolTabId = "all" | "business" | "internet" | "court" | "custom";

interface RolePoolProps {
  roles: CouncilRole[];
  assignedRoleIds: Set<string>;
  onCreateRole: (payload: CreateRoleInput) => void;
}

const ROLE_TABS: Array<{ id: RolePoolTabId; label: string }> = [
  { id: "all", label: "全部" },
  { id: "business", label: "商业帝国" },
  { id: "internet", label: "互联网大厂" },
  { id: "court", label: "法庭激辩" },
  { id: "custom", label: "自定义" },
];

function resolveRoleTab(role: CouncilRole): Exclude<RolePoolTabId, "all"> {
  if (role.id.startsWith("custom-")) return "custom";
  if (role.id === "legal") return "court";
  if (role.id === "pm" || role.id === "ops") return "internet";
  return "business";
}

export function RolePool({
  roles,
  assignedRoleIds,
  onCreateRole,
}: RolePoolProps) {
  const [activeTab, setActiveTab] = useState<RolePoolTabId>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredRoles = useMemo(() => {
    if (activeTab === "all") return roles;
    return roles.filter((role) => resolveRoleTab(role) === activeTab);
  }, [activeTab, roles]);

  function handleCreateRole(payload: CreateRoleInput) {
    onCreateRole(payload);
    setActiveTab("custom");
    setIsCreateModalOpen(false);
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 h-[32vh] min-h-[280px] w-full border-t border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col">
          <div className="border-b border-white/8 px-6 pb-4 pt-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/55">
                  Role Deck
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-[0.08em] text-white">
                  意识体手牌区
                </h2>
                <p className="mt-1 text-sm text-white/45">
                  选择分类、构建新角色，并将卡牌拖拽到上方全息底座参与本轮议事。
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
                {roles.length} Roles Online
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {ROLE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-medium transition",
                    activeTab === tab.id
                      ? "border-cyan-300/35 bg-cyan-400/14 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                      : "border-white/10 bg-white/5 text-white/55 hover:border-white/18 hover:bg-white/10 hover:text-white/80"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-row gap-4 overflow-x-auto px-6 pb-6 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="sticky left-0 z-10 flex h-full min-h-[190px] w-[220px] shrink-0 flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-cyan-300/25 bg-[#050b16]/95 px-5 text-center shadow-[0_0_40px_rgba(34,211,238,0.08)] transition hover:-translate-y-1 hover:border-cyan-200/45 hover:bg-[#081120]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-cyan-300/20 bg-cyan-400/10 text-4xl text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
                +
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/55">
                  Consciousness Forge
                </p>
                <p className="mt-3 text-sm font-semibold tracking-[0.08em] text-white">
                  [ 构建新意识体 // CREATE ROLE ]
                </p>
                <p className="mt-2 text-xs leading-6 text-white/45">
                  打开创建终端，自定义新的立场人格并注入角色池。
                </p>
              </div>
            </button>

            {filteredRoles.map((role) => (
              <DraggableRoleCard
                key={role.id}
                role={role}
                disabled={assignedRoleIds.has(role.id)}
              />
            ))}

            {filteredRoles.length === 0 ? (
              <div className="flex min-h-[190px] w-[260px] shrink-0 flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.03] px-6 text-center">
                <p className="text-sm font-medium text-white/72">
                  当前分类还没有角色
                </p>
                <p className="mt-2 text-xs leading-6 text-white/42">
                  试试切换 Tab，或者立刻创建一个新的意识体补上这个阵营。
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <CreateRoleModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRole}
      />
    </>
  );
}
