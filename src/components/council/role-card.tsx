import type { CouncilRole } from "@/types/council";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: CouncilRole;
}

export function RoleCard({ role }: RoleCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300",
        "hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
          role.color
        )}
      />
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          {role.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              {role.name}
            </h3>
            <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/70">
              {role.bias}
            </span>
          </div>

          <p className="mt-1 text-sm text-white/85">{role.title}</p>
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/60">
            {role.description}
          </p>
        </div>
      </div>
    </div>
  );
}