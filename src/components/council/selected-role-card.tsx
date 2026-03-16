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
        "relative w-full overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] p-4 text-left backdrop-blur-xl",
        "shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
          role.color
        )}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-2xl">
              {role.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{role.name}</h3>
                <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {role.bias}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/85">{role.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-full border border-white/12 bg-black/20 px-3 py-1 text-xs text-white/75 transition hover:border-white/20 hover:bg-black/30 hover:text-white"
          >
            移除
          </button>
        </div>

        <p className="relative mt-3 text-xs leading-5 text-white/65">
          {role.description}
        </p>
      </div>
    </div>
  );
}
