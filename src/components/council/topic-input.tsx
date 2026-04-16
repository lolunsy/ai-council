interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCount: number;
  canStart: boolean;
  onStart: () => void;
  isStarting?: boolean;
}

export function TopicInput({
  value,
  onChange,
  selectedCount,
  canStart,
  onStart,
  isStarting = false,
}: TopicInputProps) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-black/40 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,rgba(8,47,73,0.22),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-cyan-100/80">
              Mission Brief // 任务简报终端
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-[0.08em] text-white md:text-4xl">
              输入议题，点亮本次 AI 议事厅
            </h1>

            <p className="mt-3 text-sm leading-7 text-white/65 md:text-base">
              指挥官可在此下达核心任务，系统将把命题广播给已接入的意识体，并在全息底座上完成席位部署。
            </p>
          </div>

          <div className="w-full max-w-[220px] rounded-[24px] border border-cyan-500/20 bg-cyan-500/10 px-5 py-4 text-left shadow-[0_0_35px_rgba(34,211,238,0.08)] lg:text-right">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/55">
              Linked Minds
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[0.18em] text-cyan-50">
              {selectedCount.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-cyan-100/60">slots synchronized</p>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-black/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:p-6">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="输入你的会议总命题，例如：我们是否应该用 1000 万预算押注一次高风险的跨界联名？"
            className="min-h-[180px] w-full resize-none bg-transparent text-xl leading-9 text-white placeholder:text-white/28 focus:outline-none md:min-h-[210px] md:text-2xl"
          />

          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
            <p>至少选择 1 位角色并输入议题后，即可启动完整会议流程。</p>
            <p className="text-cyan-100/65">
              Neural uplink stable // runtime ready
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onStart}
            disabled={!canStart}
            className="inline-flex min-h-[64px] w-full max-w-3xl items-center justify-center rounded-[24px] border border-cyan-300/30 bg-cyan-400/15 px-8 text-base font-semibold tracking-[0.12em] text-cyan-50 shadow-[0_0_40px_rgba(34,211,238,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-cyan-300/20 hover:shadow-[0_0_50px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/35 disabled:shadow-none md:min-h-[72px] md:text-lg"
          >
            {isStarting
              ? "[ COUNCIL LINKING // 正在启动 ]"
              : "[ INITIATE COUNCIL // 启动议事厅 ]"}
          </button>
        </div>
      </div>
    </div>
  );
}
