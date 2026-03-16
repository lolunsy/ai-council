import type { CouncilRole } from "@/types/council";
import { cn } from "@/lib/utils";

interface SelectedRoleCardProps {
  role: CouncilRole;
  onRemove: () => void;
}

export function SelectedRoleCard({
  role,
  onRemove,
}: SelectedRoleCardProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-white/14 bg-white/[0.07] p-4 text-left backdrop-blur-xl",
        "shadow-[0_20px_70px_rgba(0,0,0,0.2)]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
          role.color
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              {role.avatar}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{role.name}</h3>
                <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {role.bias}
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-white/90">
                {role.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-full border border-white/14 bg-black/20 px-3 py-1 text-xs text-white/75 transition hover:border-white/25 hover:bg-black/30 hover:text-white"
          >
            移除
          </button>
        </div>

        <div className="mt-3 rounded-2xl border border-white/8 bg-black/10 px-3 py-2">
          <p className="text-xs leading-5 text-white/70">{role.description}</p>
        </div>
      </div>
    </div>
  );
}

