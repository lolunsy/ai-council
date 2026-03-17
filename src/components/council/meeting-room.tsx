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

interface ModeratorMessage {
  id: string;
  message: string;
}

export function MeetingRoom({
  topic,
  roles,
  rounds,
  onBack,
  onFollowUp,
}: MeetingRoomProps) {
  const [showMiniBar, setShowMiniBar] = useState(false);

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

  const statusText = "会议已完成，可继续追问";
  const canFollowUp = true;

  async function handleModeratorSubmit(message: string) {
    await onFollowUp(message);
  }

  return (
    <main className="flex flex-1 flex-col">
      <MeetingMiniBar
        visible={showMiniBar}
        statusText={statusText}
        visibleCount={rounds.length}
        totalCount={rounds.length}
        participantRoleIds={participantRoleIds}
        activeRoleId={"ceo"}
      />

      <MeetingHeader
        topic={topic}
        participantRoleIds={participantRoleIds}
        onBack={onBack}
        statusText={statusText}
      />

      <section className="mt-8 flex flex-col gap-10">
        {rounds.map((round, index) => (
          <div key={round.id} className="space-y-6">
            {index > 0 && (
              <RoundDivider
                title="Round"
                subtitle={`Round ${index + 1} of ${rounds.length}`}
              />
            )}

            {round.followUp && (
              <ModeratorNoteCard message={round.followUp} />
            )}

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




