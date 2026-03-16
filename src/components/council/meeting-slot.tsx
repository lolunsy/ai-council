interface MeetingSlotProps {
  index: number;
}

export function MeetingSlot({ index }: MeetingSlotProps) {
  return (
    <div className="relative flex min-h-[132px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-4 backdrop-blur-md">
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
        Seat {index + 1}
      </div>

      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-lg text-white/60">
          +
        </div>
        <p className="text-sm text-white/70">拖入参会角色</p>
        <p className="mt-1 text-xs text-white/40">准备进入 AI 议事厅</p>
      </div>
    </div>
  );
}