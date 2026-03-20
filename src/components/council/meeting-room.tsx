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
    if (!latestRound) return;
    if (latestRound.reports.length > 0 || latestRound.finalDecision || isGenerating) {
      return;
    }

    let cancelled = false;
    const roundId = latestRound.id;
    const roundFollowUp = latestRound.followUp;

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
            followUp: roundFollowUp,
            settings,
          });

          if (cancelled) return;

          generatedReports.push(report);

          onRoundGenerated({
            id: roundId,
            topic,
            followUp: roundFollowUp,
            reports: [...generatedReports],
            finalDecision: null,
          });
        }

        if (cancelled) return;

        setActiveRoleIndex(roles.length);
        setCurrentPhase("裁判长正在综合裁决");

        const finalDecision = await generateJudgeDecision({
          topic,
          followUp: roundFollowUp,
          settings,
          reports: generatedReports.map((item) => ({
            speaker: item.speaker,
            content: item.content,
          })),
        });

        if (cancelled) return;

        onRoundGenerated({
          id: roundId,
          topic,
          followUp: roundFollowUp,
          reports: generatedReports,
          finalDecision,
        });

        setCurrentPhase("裁判长已完成总结，可继续追问");
      } catch (error) {
        setCurrentPhase(
          error instanceof Error ? error.message : "会议生成失败"
        );
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
          setActiveRoleIndex(-1);
        }
      }
    }

    runRound();

    return () => {
      cancelled = true;
    };
  }, [latestRound?.id]);

  const participantRoleIds = useMemo(
    () => roles.map((role) => role.id),
    [roles]
  );

  const completedCount = Math.min(
    (latestRound?.reports.length || 0) + (latestRound?.finalDecision ? 1 : 0),
    roles.length + 1
  );
  const totalCount = roles.length + 1;

  const activeRoleId = 
    activeRoleIndex >= 0 && activeRoleIndex < roles.length
      ? roles[activeRoleIndex]?.id
      : activeRoleIndex === roles.length
        ? "ceo"
        : null;

  async function handleModeratorSubmit(message: string) {
    await onFollowUp(message);
  }

  return (
    <main className="flex flex-1 flex-col">
      <MeetingMiniBar
        visible={showMiniBar}
        statusText={currentPhase}
        visibleCount={completedCount}
        totalCount={totalCount}
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
        {rounds.map((round, roundIndex) => (
          <div key={round.id} className="space-y-6">
            <RoundDivider
              title={`第 ${roundIndex + 1} 轮讨论`}
              subtitle={round.followUp ? "基于主持人补充信息的新一轮讨论" : "会议初始讨论"}
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
        ))}
      </section>

      <ModeratorPanel
        onSubmit={handleModeratorSubmit}
        disabled={isGenerating || !latestRound?.finalDecision}
      />
    </main>
  );
}
