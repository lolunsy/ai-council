"use client";

import { motion } from "framer-motion";
import { MOCK_MEETING_TOPIC, MOCK_REPORTS } from "@/data/mock-meeting";
import { ReportCard } from "./report-card";

interface MeetingRoomProps {
  onBack: () => void;
}

export function MeetingRoom({ onBack }: MeetingRoomProps) {
  return (
    <motion.main
      key="meeting-room"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35 }}
      className="flex flex-1 flex-col"
    >
      <section className="pt-8 md:pt-10">
        <div className="flex flex-col gap-5 rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-3 inline-flex items-center rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100/85">
                AI Council / Meeting Room
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.08]">
                会议已开始
              </h1>

              <p className="mt-4 text-sm leading-7 text-white/65 md:text-base">
                以下为各位角色围绕当前议题给出的完整判断、论证路径与最终建议。
              </p>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
            >
              返回备战厅
            </button>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              本次议题
            </p>
            <p className="mt-2 text-lg font-medium leading-8 text-white">
              {MOCK_MEETING_TOPIC}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-6 pb-10">
        {MOCK_REPORTS.map((report, index) => (
          <ReportCard
            key={report.id}
            roleId={report.roleId}
            speaker={report.speaker}
            title={report.title}
            badge={report.badge}
            summary={report.summary}
            content={report.content}
            reasoning={report.reasoning}
            isFinal={index === MOCK_REPORTS.length - 1}
          />
        ))}
      </section>
    </motion.main>
  );
}

