import { ROLE_LIBRARY } from "@/data/roles";
import { cn } from "@/lib/utils";

interface ParticipantStripProps {
  roleIds: string[];
}

export function ParticipantStrip({ roleIds }: ParticipantStripProps) {
  const roles = roleIds
    .map((roleId) => ROLE_LIBRARY.find((role) => role.id === roleId))
    .filter(Boolean);

  return (
    <div className="rounded-[24px] border border-white/8 bg-black/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/40">
            参会成员
          </p>
          <p className="mt-1 text-sm text-white/65">
            当前参与本轮讨论的角色与裁决者
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
          {roles.length} Participants
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {roles.map((role) => (
          <div
            key={role!.id}
            className={cn(
              "relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2",
              "shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70",
                role!.color
              )}
            />
            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-xl">
              {role!.avatar}
            </div>
            <div className="relative z-10 min-w-0">
              <p className="text-sm font-medium text-white">{role!.name}</p>
              <p className="text-xs text-white/55">{role!.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
