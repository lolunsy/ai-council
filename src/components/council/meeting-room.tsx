"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  FinalDecision,
  MeetingReport,
  MeetingRoleInput,
} from "@/types/meeting";
import { getMeetingStatusText } from "@/lib/mock-meeting-flow";
import { MeetingHeader } from "./meeting-header";
import { MeetingMiniBar } from "./meeting-mini-bar";
import { ModeratorNoteCard } from "./moderator-note-card";
import { ModeratorPanel } from "./moderator-panel";
import { ReportCard } from "./report-card";
import { RoundDivider } from "./round-divider";

interface MeetingRound {
  id: string;
  topic: string;
  followUp?: string;
  reports: MeetingReport[];
  finalDecision: FinalDecision;
}

interface MeetingRoomProps {
  topic: string;
  roles: MeetingRoleInput[];
  rounds: MeetingRound[];
  onBack: () => void;
  onFollowUp: (message: string) => void | Promise<void>;
}

export function MeetingRoom({
  topic,
  roles,
  rounds,
  onBack,
  onFollowUp,
}: MeetingRoomProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showMiniBar, setShowMiniBar] = useState(false);

  const latestRound = rounds[rounds.length - 1];
  const totalCount = latestRound ? latestRound.reports.length + 1 : 0;

  useEffect(() => {
    setVisibleCount(0);
  }, [latestRound?.id]);

  useEffect(() => {
    if (!latestRound) return;
    if (visibleCount >= totalCount) return;

    const timer = window.setTimeout(() => {
      setVisibleCount((current) => current + 1);
    }, visibleCount === 0 ? 800 : 1200);

    return () => window.clearTimeout(timer);
  }, [visibleCount, totalCount, latestRound]);

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

  const latestVisibleReports = latestRound
    ? latestRound.reports.slice(0, Math.min(visibleCount, latestRound.reports.length))
    : [];

  const showLatestFinalDecision = latestRound
    ? visibleCount > latestRound.reports.length
    : false;

  const statusText = getMeetingStatusText(visibleCount, totalCount || 1);
  const canFollowUp = latestRound ? visibleCount >= totalCount : false;

  const activeRoleId =
    latestRound && visibleCount > 0 && visibleCount <= latestRound.reports.length
      ? latestRound.reports[Math.min(visibleCount - 1, latestRound.reports.length - 1)]?.roleId
      : showLatestFinalDecision
        ? "ceo"
        : null;

  async function handleModeratorSubmit(message: string) {
    await onFollowUp(message);
  }

  return (
    <main className="flex flex-1 flex-col">
      <MeetingMiniBar
        visible={showMiniBar}
        statusText={statusText}
        visibleCount={visibleCount}
        totalCount={totalCount || 1}
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
        {rounds.map((round, roundIndex) => {
          const isLatestRound = round.id === latestRound?.id;

          const visibleReports = isLatestRound
            ? latestVisibleReports
            : round.reports;

          const showFinalDecision = isLatestRound
            ? showLatestFinalDecision
            : true;

          return (
            <div key={round.id} className="space-y-6">
              <RoundDivider
                title={`第 ${roundIndex + 1} 轮讨论`}
                subtitle={
                  round.followUp
                    ? "基于主持人补充信息发起的新一轮讨论"
                    : "会议初始讨论"
                }
              />

              {round.followUp ? (
                <ModeratorNoteCard message={round.followUp} />
              ) : null}

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
                  speaker={round.finalDecision.speaker}
                  title="综合裁决与折中方案"
                  badge="Decision"
                  summary={round.finalDecision.summary}
                  content={round.finalDecision.content}
                  reasoning={round.finalDecision.reasoning}
                  isFinal
                />
              ) : null}
            </div>
          );
        })}
      </section>

      <ModeratorPanel
        onSubmit={handleModeratorSubmit}
        disabled={!canFollowUp}
      />
    </main>
  );
}





