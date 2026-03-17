"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DEFAULT_MEETING_MODEL } from "@/data/models";
import { startMeetingRequest } from "@/lib/api";
import type {
  FinalDecision,
  MeetingReport,
  MeetingRoleInput,
} from "@/types/meeting";
import { MeetingRoom } from "./meeting-room";
import { PrepHall } from "./prep-hall";

interface MeetingRound {
  id: string;
  topic: string;
  followUp?: string;
  reports: MeetingReport[];
  finalDecision: FinalDecision;
}

interface MeetingSessionData {
  topic: string;
  roles: MeetingRoleInput[];
  model: string;
  rounds: MeetingRound[];
}

export function CouncilStage() {
  const [isDiscussing, setIsDiscussing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionData, setSessionData] = useState<MeetingSessionData | null>(null);

  async function handleStartMeeting(input: {
    topic: string;
    roles: MeetingRoleInput[];
    model: string;
  }) {
    try {
      setErrorMessage("");
      setIsStarting(true);

      const result = await startMeetingRequest({
        topic: input.topic,
        roles: input.roles,
        model: input.model || DEFAULT_MEETING_MODEL,
      });

      setSessionData({
        topic: input.topic,
        roles: input.roles,
        model: input.model || DEFAULT_MEETING_MODEL,
        rounds: [
          {
            id: `round-${Date.now()}`,
            topic: input.topic,
            reports: result.reports,
            finalDecision: result.finalDecision,
          },
        ],
      });

      setIsDiscussing(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "启动会议失败"
      );
    } finally {
      setIsStarting(false);
    }
  }

  async function handleFollowUp(message: string) {
    if (!sessionData) return;

    const result = await startMeetingRequest({
      topic: sessionData.topic,
      roles: sessionData.roles,
      followUp: message,
      model: sessionData.model || DEFAULT_MEETING_MODEL,
    });

    setSessionData((current) => {
      if (!current) return current;

      return {
        ...current,
        rounds: [
          ...current.rounds,
          {
            id: `round-${Date.now()}`,
            topic: current.topic,
            followUp: message,
            reports: result.reports,
            finalDecision: result.finalDecision,
          },
        ],
      };
    });
  }

  return (
    <AnimatePresence mode="wait">
      {isDiscussing && sessionData ? (
        <MeetingRoom
          key="meeting-room"
          topic={sessionData.topic}
          roles={sessionData.roles}
          rounds={sessionData.rounds}
          onBack={() => setIsDiscussing(false)}
          onFollowUp={handleFollowUp}
        />
      ) : (
        <PrepHall
          key="prep-hall"
          onStartMeeting={handleStartMeeting}
          isStarting={isStarting}
          errorMessage={errorMessage}
        />
      )}
    </AnimatePresence>
  );
}


