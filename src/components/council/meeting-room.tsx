"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createModeratorReply,
  MOCK_MEETING_TOPIC,
  MOCK_REPORTS,
  type ModeratorReply,
} from "@/data/mock-meeting";
import {
  getMeetingStatusText,
  getVisibleReports,
} from "@/lib/mock-meeting-flow";
import { MeetingHeader } from "./meeting-header";
import { ModeratorNoteCard } from "./moderator-note-card";
import { ModeratorPanel } from "./moderator-panel";
import { ReportCard } from "./report-card";

interface MeetingRoomProps {
  onBack: () => void;
}

interface ModeratorMessage {
  id: string;
  message: string;
}

export function MeetingRoom({ onBack }: MeetingRoomProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [moderatorMessages, setModeratorMessages] = useState<ModeratorMessage[]>([]);
  const [moderatorReplies, setModeratorReplies] = useState<ModeratorReply[]>([]);

  useEffect(() => {
    if (visibleCount >= MOCK_REPORTS.length) return;

    const timer = window.setTimeout(() => {
      setVisibleCount((current) => current + 1);
    }, visibleCount === 0 ? 450 : 850);

    return () => window.clearTimeout(timer);
  }, [visibleCount]);

  const visibleReports = useMemo(
    () => getVisibleReports(MOCK_REPORTS, visibleCount),
    [visibleCount]
  );

  const participantRoleIds = useMemo(
    () => MOCK_REPORTS.map((report) => report.roleId),
    []
  );

  const statusText = getMeetingStatusText(visibleCount, MOCK_REPORTS.length);
  const canFollowUp = visibleCount >= MOCK_REPORTS.length;

  function handleModeratorSubmit(message: string) {
    const note = {
      id: `moderator-note-${Date.now()}`,
      message,
    };

    const reply = createModeratorReply(message);

    setModeratorMessages((current) => [...current, note]);
    setModeratorReplies((current) => [...current, reply]);
  }

  return (
    <main className="flex flex-1 flex-col">
      <MeetingHeader
        topic={MOCK_MEETING_TOPIC}
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
            title={report.title}
            badge={report.badge}
            summary={report.summary}
            content={report.content}
            reasoning={report.reasoning}
            isFinal={index === visibleReports.length - 1 && visibleCount >= MOCK_REPORTS.length}
          />
        ))}

        {moderatorMessages.map((note, index) => (
          <div key={note.id} className="space-y-6">
            <ModeratorNoteCard message={note.message} />

            {moderatorReplies[index] ? (
              <ReportCard
                roleId={moderatorReplies[index].roleId}
                speaker={moderatorReplies[index].speaker}
                title={moderatorReplies[index].title}
                badge={moderatorReplies[index].badge}
                summary={moderatorReplies[index].summary}
                content={moderatorReplies[index].content}
                reasoning={"### 说明\n- 当前为前端假追问流程\n- 下一阶段可替换为真实多角色再议逻辑"}
                isFinal
              />
            ) : null}
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


