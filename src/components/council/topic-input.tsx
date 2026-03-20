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
<div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
<div className="rounded-[22px] border border-white/8 bg-[#0a1628]/85 p-3">
<textarea
value={value}
onChange={(event) => onChange(event.target.value)}
placeholder="请输入本次会议议题，例如：我们要不要花 1000 万做跨界联名？"
className="min-h-[140px] w-full resize-none bg-transparent px-2 py-2 text-sm leading-7 text-white placeholder:text-white/30 focus:outline-none"
/>

    <div className="mt-3 flex items-end justify-between gap-4 border-t border-white/8 px-2 pt-3">
      <div className="space-y-1">
        <p className="text-xs text-white/45">
          已选择 {selectedCount} 位角色，至少选择 1 位角色并输入议题后才可开始
        </p>
        <p className="text-xs text-white/28">
          当前已接入会议引擎链路，模型与接口配置请使用右上角设置入口
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        disabled={!canStart}
        className="inline-flex h-12 min-w-[118px] items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/15 px-5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/35"
      >
        {isStarting ? "会议启动中..." : "开始开会"}
      </button>
    </div>
  </div>
</div>

);
}




