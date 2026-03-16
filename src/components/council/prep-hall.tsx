import { ROLE_LIBRARY } from "@/data/roles";
import { MeetingSlot } from "./meeting-slot";
import { RoleCard } from "./role-card";
import { TopicInput } from "./topic-input";

export function PrepHall() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="pt-8 md:pt-12">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/60 backdrop-blur-md">
            AI Council / Pre-Meeting Chamber
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.05]">
            AI 议事厅
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            选择不同立场的 AI 角色加入会议，让它们围绕同一议题展开深度辩论、举证与互相拆台，
            最终由裁判长综合所有意见，输出可执行的折中方案。
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">会议坑位</h2>
              <p className="mt-1 text-sm text-white/45">
                后续这里将支持拖拽入坑、替换、排序与移除
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
              3 - 4 位参会角色
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <MeetingSlot index={0} />
            <MeetingSlot index={1} />
            <MeetingSlot index={2} />
            <MeetingSlot index={3} />
          </div>

          <TopicInput />
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">角色库</h2>
              <p className="mt-1 text-sm text-white/45">
                当前先展示静态角色卡，下一步接入 DnD 拖拽
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/50">
              {ROLE_LIBRARY.length} Roles
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ROLE_LIBRARY.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}