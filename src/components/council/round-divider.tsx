interface RoundDividerProps {
  title: string;
  subtitle?: string;
}

export function RoundDivider({ title, subtitle }: RoundDividerProps) {
  return (
    <div className="relative py-2">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/8" />
      <div className="relative mx-auto flex w-fit flex-col items-center rounded-full border border-white/10 bg-[#091426]/95 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-100/75">
          {title}
        </p>
        {subtitle ? (
          <p className="mt-1 text-[11px] text-white/45">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
