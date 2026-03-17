"use client";

import { useEffect, useState } from "react";
import type { FinalDecision, MeetingReport, MeetingRoleInput } from "@/types/meeting";
import { MeetingHeader } from "./meeting-header";
import { MeetingMiniBar } from "./meeting-mini-bar";
import { ModeratorNoteCard } from "./moderator-note-card";
import { ModeratorPanel } from "./moderator-panel";
import { ReportCard } from "./report-card";

interface MeetingRoomProps {
  topic: string;
  roles: MeetingRoleInput[];
  reports: MeetingReport[];
  finalDecision: FinalDecision;
  onBack: () => void;
  onFollowUp: (message: string) => void;
}

interface ModeratorMessage {
  id: string;
  message: string;
}

export function MeetingRoom({
  topic,
  roles,
  reports,
  finalDecision,
  onBack,
  onFollowUp,
}: MeetingRoomProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [moderatorMessages, setModeratorMessages] = useState<ModeratorMessage[]>([]);
  const [showMiniBar, setShowMiniBar] = useState(false);

  useEffect(() => {
    if (visibleCount >= reports.length) return;

    const timer = window.setTimeout(() => {
      setVisibleCount((current) => current + 1);
    }, visibleCount === 0 ? 800 : 1200);

    return () => window.clearTimeout(timer);
  }, [visibleCount, reports.length]);

  useEffect(() => {
    function handleScroll() {
      setShowMiniBar(window.scrollY > 220);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleReports = reports.slice(0, visibleCount);
  const participantRoleIds = roles.map((role) => role.id);
  const statusText = visibleCount < reports.length
    ? `正在听取第 ${visibleCount} 位角色发言`
    : "裁判长已完成总结，可继续追问";
  const canFollowUp = visibleCount >= reports.length;

  const activeRoleId =
    visibleCount > 0 && visibleCount <= reports.length
      ? reports[Math.min(visibleCount - 1, reports.length - 1)]?.roleId
      : null;

  function handleModeratorSubmit(message: string) {
    const note = {
      id: `moderator-note-${Date.now()}`,
      message,
    };

    setModeratorMessages((current) => [...current, note]);
    onFollowUp(message);
  }

  return (
    <main className="flex flex-1 flex-col">
      <MeetingMiniBar
        visible={showMiniBar}
        statusText={statusText}
        visibleCount={visibleCount}
        totalCount={reports.length}
        participantRoleIds={participantRoleIds}
        activeRoleId={activeRoleId}
      />

      <MeetingHeader
        topic={topic}
        participantRoleIds={participantRoleIds}
        onBack={onBack}
        statusText={statusText}
      />

      <section className="mt-8 flex flex-col gap-6">
        {visibleReports.map((report, index) => (
          <ReportCard
            key={report.id}
            roleId={report.roleId}
            speaker={report.speaker}
            title={report.speaker}
            badge="Report"
            summary={report.summary}
            content={report.content}
            reasoning={report.reasoning}
            isFinal={
              index === visibleReports.length - 1 &&
              visibleCount >= reports.length
            }
          />
        ))}

        {visibleCount >= reports.length && (
          <ReportCard
            key="final-decision"
            roleId="final"
            speaker={finalDecision.speaker}
            title={finalDecision.speaker}
            badge="Final"
            summary={finalDecision.summary}
            content={finalDecision.content}
            reasoning={finalDecision.reasoning}
            isFinal
          />
        )}

        {moderatorMessages.map((note) => (
          <div key={note.id} className="space-y-6">
            <ModeratorNoteCard message={note.message} />
          </div>
        ))}
      </section>

      <ModeratorPanel
        onSubmit={handleModeratorSubmit}
        disabled={!canFollowUp}
      />
    </main>
  );
}




