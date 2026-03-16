export function TopicInput() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="rounded-[22px] border border-white/8 bg-[#0a1628]/80 p-3">
        <textarea
          placeholder="请输入本次会议议题，例如：我们要不要花 1000 万做跨界联名？"
          className="min-h-[120px] w-full resize-none bg-transparent px-2 py-2 text-sm leading-7 text-white placeholder:text-white/30 focus:outline-none"
          readOnly
        />
        <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/8 px-2 pt-3">
          <p className="text-xs text-white/40">
            先完成静态壳子，下一步接入角色拖拽与议题状态校验
          </p>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/15 px-5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
          >
            开始开会
          </button>
        </div>
      </div>
    </div>
  );
}