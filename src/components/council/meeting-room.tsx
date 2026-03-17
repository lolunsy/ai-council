"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  FinalDecision,
  MeetingReport,
  MeetingRoleInput,
} from "@/types/meeting";
import {
  getMeetingStatusText,
} from "@/lib/mock-meeting-flow";
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
  onFollowUp: (message: string) => void | Promise<void>;
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
  const [moderatorMessages, setModeratorMessages] = useState<ModeratorMessage[]>(
    []
  );
  const [showMiniBar, setShowMiniBar] = useState(false);

  const totalCount = reports.length + 1;

  useEffect(() => {
    setVisibleCount(0);
  }, [topic, reports, finalDecision]);

  useEffect(() => {
    if (visibleCount >= totalCount) return;

    const timer = window.setTimeout(() => {
      setVisibleCount((current) => current + 1);
    }, visibleCount === 0 ? 800 : 1200);

    return () => window.clearTimeout(timer);
  }, [visibleCount, totalCount]);

  useEffect(() => {
    function handleScroll() {
      setShowMiniBar(window.scrollY > 220);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const participantRoleIds = useMemo(
    () => roles.map((role) => role.id),
    [roles]
  );

  const visibleReports = reports.slice(0, Math.min(visibleCount, reports.length));
  const showFinalDecision = visibleCount > reports.length;
  const statusText = getMeetingStatusText(visibleCount, totalCount);
  const canFollowUp = visibleCount >= totalCount;

  const activeRoleId =
    visibleCount > 0 && visibleCount <= reports.length
      ? reports[Math.min(visibleCount - 1, reports.length - 1)]?.roleId
      : showFinalDecision
        ? "ceo"
        : null;

  async function handleModeratorSubmit(message: string) {
    const note = {
      id: `moderator-note-${Date.now()}`,
      message,
    };

    setModeratorMessages((current) => [...current, note]);
    await onFollowUp(message);
  }

  return (
    <main className="flex flex-1 flex-col">
      <MeetingMiniBar
        visible={showMiniBar}
        statusText={statusText}
        visibleCount={visibleCount}
        totalCount={totalCount}
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
        {visibleReports.map((report) => (
          <ReportCard
            key={report.id}
            roleId={report.roleId}
            speaker={report.speaker}
            title=""
            badge="Role Report"
            summary={report.summary}
            content={report.content}
            reasoning={report.reasoning}
          />
        ))}

        {showFinalDecision ? (
          <ReportCard
            roleId="ceo"
            speaker={finalDecision.speaker}
            title="综合裁决与折中方案"
            badge="Decision"
            summary={finalDecision.summary}
            content={finalDecision.content}
            reasoning={finalDecision.reasoning}
            isFinal
          />
        ) : null}

        {moderatorMessages.map((note) => (
          <ModeratorNoteCard key={note.id} message={note.message} />
        ))}
      </section>

      <ModeratorPanel
        onSubmit={handleModeratorSubmit}
        disabled={!canFollowUp}
      />
    </main>
  );
}




