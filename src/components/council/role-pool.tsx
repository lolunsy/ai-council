import type { CouncilRole } from "@/types/council";
import { DraggableRoleCard } from "./draggable-role-card";

interface RolePoolProps {
  roles: CouncilRole[];
  assignedRoleIds: Set<string>;
}

export function RolePool({ roles, assignedRoleIds }: RolePoolProps) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">角色库</h2>
          <p className="mt-1 text-sm text-white/45">
            拖拽角色卡到左侧坑位，已入会角色会自动置灰
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/50">
          {roles.length} Roles
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <DraggableRoleCard
            key={role.id}
            role={role}
            disabled={assignedRoleIds.has(role.id)}
          />
        ))}
      </div>
    </div>
  );
}
