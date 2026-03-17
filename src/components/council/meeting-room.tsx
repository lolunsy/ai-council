"use client";

import { motion } from "framer-motion";
import { MOCK_MEETING_TOPIC, MOCK_REPORTS, type MockReport } from "@/data/mock-meeting";
import { ReportCard } from "./report-card";

export function MeetingRoom() {
  const reports = MOCK_REPORTS;
  const finalReport = reports.find((report) => report.speaker === "裁判长");
  const regularReports = reports.filter((report) => report.speaker !== "裁判长");

  return (
    <main className="flex flex-1 flex-col">
      <section className="pt-8 md:pt-12">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/60 backdrop-blur-md">
            AI Council / Meeting Room
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.05]">
            会议进行中
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            各位 AI 角色正在围绕议题展开深度讨论与举证，最终将由裁判长给出综合裁决。
          </p>
        </div>
      </section>

      <section className="mt-8 max-w-4xl">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">会议议题</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/75">{MOCK_MEETING_TOPIC}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        {regularReports.map((report) => (
          <ReportCard
            key={report.id}
            speaker={report.speaker}
            title={report.title}
            badge={report.badge}
            summary={report.summary}
            content={report.content}
            reasoning={report.reasoning}
            roleId={report.roleId}
          />
        ))}

        {finalReport ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8"
          >
            <ReportCard
              speaker={finalReport.speaker}
              title={finalReport.title}
              badge={finalReport.badge}
              summary={finalReport.summary}
              content={finalReport.content}
              reasoning={finalReport.reasoning}
              roleId={finalReport.roleId}
              isFinal
            />
          </motion.div>
        ) : null}
      </section>
    </main>
  );
}
