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
    <div className="w-full max-w-3xl mx-auto bg-[#060d18]/80 border border-cyan-500/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/70">
            Mission Brief
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            任务简报终端
          </h2>
        </div>

        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100/80">
          已连接 {selectedCount.toString().padStart(2, "0")} 席
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-black/20 p-4">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="输入本次议题，例如：我们是否要在预算受限的情况下继续推进跨界联名？"
          className="min-h-[100px] w-full resize-none bg-transparent text-lg leading-8 text-white placeholder:text-white/28 focus:outline-none"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-cyan-500/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/55">
          选择至少 1 位角色并输入议题后即可启动议事厅。
        </p>

        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-6 text-sm font-semibold tracking-[0.12em] text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/35"
        >
          {isStarting
            ? "[ COUNCIL LINKING // 正在启动 ]"
            : "[ INITIATE COUNCIL // 启动议事厅 ]"}
        </button>
      </div>
    </div>
  );
}
