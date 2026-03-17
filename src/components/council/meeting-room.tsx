"use client";

import { MOCK_MEETING_TOPIC, MOCK_REPORTS } from "@/data/mock-meeting";
import { MeetingHeader } from "./meeting-header";
import { ModeratorPanel } from "./moderator-panel";
import { ReportCard } from "./report-card";

interface MeetingRoomProps {
  onBack: () => void;
}

export function MeetingRoom({ onBack }: MeetingRoomProps) {
  const participantRoleIds = MOCK_REPORTS.map((report) => report.roleId);

  return (
    <main className="flex flex-1 flex-col">
      <MeetingHeader
        topic={MOCK_MEETING_TOPIC}
        participantRoleIds={participantRoleIds}
        onBack={onBack}
      />

      <section className="mt-8 flex flex-col gap-6">
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

      <ModeratorPanel />
    </main>
  );
}

