"use client";

import { useEffect, useMemo, useState } from "react";
import { generateJudgeDecision, generateRoleReport } from "@/lib/api";
import type {
  FinalDecision,
  MeetingReport,
  MeetingRoleInput,
} from "@/types/meeting";
import type { MeetingRuntimeSettings } from "@/types/settings";
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
  finalDecision?: FinalDecision | null;
}

interface MeetingRoomProps {
  topic: string;
  roles: MeetingRoleInput[];
  rounds: MeetingRound[];
  settings: MeetingRuntimeSettings;
  onBack: () => void;
  onFollowUp: (message: string) => void | Promise<void>;
  onRoundGenerated: (round: MeetingRound) => void;
}

export function MeetingRoom({
  topic,
  roles,
  rounds,
  settings,
  onBack,
  onFollowUp,
  onRoundGenerated,
}: MeetingRoomProps) {
  const [showMiniBar, setShowMiniBar] = useState(false);
  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(-1);
  const [currentPhase, setCurrentPhase] = useState("会议准备中");
  const [isGenerating, setIsGenerating] = useState(false);

  const latestRound = rounds[rounds.length - 1];

  useEffect(() => {
    function handleScroll() {
      setShowMiniBar(window.scrollY > 220);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const needsGeneration = 
      latestRound && 
      latestRound.reports.length === 0 && 
      !latestRound.finalDecision && 
      !isGenerating;

    if (!needsGeneration) return;

    let cancelled = false;

    async function runRound() {
      try {
        setIsGenerating(true);

        const generatedReports: MeetingReport[] = [];

        for (let i = 0; i < roles.length; i += 1) {
          if (cancelled) return;

          const role = roles[i];
          setActiveRoleIndex(i);
          setCurrentPhase(`${role.name} 正在形成判断`);

          const report = await generateRoleReport({
            topic,
            role,
            followUp: latestRound.followUp,
            settings,
          });

          generatedReports.push(report);

          onRoundGenerated({
            ...latestRound,
            reports: [...generatedReports],
            finalDecision: null,
          });
        }

        if (cancelled) return;

        setActiveRoleIndex(roles.length);
        setCurrentPhase("裁判长正在综合裁决");

        const finalDecision = await generateJudgeDecision({
          topic,
          followUp: latestRound.followUp,
          settings,
          reports: generatedReports.map((item) => ({
            speaker: item.speaker,
            content: item.content,
          })),
        });

        onRoundGenerated({
          ...latestRound,
          reports: generatedReports,
          finalDecision,
        });

        setActiveRoleIndex(-1);
        setCurrentPhase("会议讨论完成");
      } finally {
        setIsGenerating(false);
      }
    }

    runRound();

    return () => {
      cancelled = true;
    };
  }, [latestRound, roles, settings, onRoundGenerated]);

  const participantRoleIds = useMemo(
    () => roles.map((role) => role.id),
    [roles]
  );

  const activeRoleId = 
    activeRoleIndex >= 0 && activeRoleIndex < roles.length
      ? roles[activeRoleIndex].id
      : activeRoleIndex === roles.length
        ? "ceo"
        : null;

  const canFollowUp = latestRound?.finalDecision !== undefined;

  async function handleModeratorSubmit(message: string) {
    await onFollowUp(message);
  }

  return (
    <main className="flex flex-1 flex-col">
      <MeetingMiniBar
        visible={showMiniBar}
        statusText={currentPhase}
        visibleCount={activeRoleIndex + 1}
        totalCount={roles.length + 1}
        participantRoleIds={participantRoleIds}
        activeRoleId={activeRoleId}
      />

      <MeetingHeader
        topic={topic}
        participantRoleIds={participantRoleIds}
        onBack={onBack}
        statusText={currentPhase}
      />

      <section className="mt-8 flex flex-col gap-6">
        {rounds.map((round, roundIndex) => {
          const isLatestRound = round.id === latestRound?.id;

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

              {round.reports.map((report) => (
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

              {round.finalDecision ? (
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
