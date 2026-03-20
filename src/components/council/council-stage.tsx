"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { startMeetingRequest } from "@/lib/api";
import {
  DEFAULT_RUNTIME_SETTINGS,
  readRuntimeSettings,
  saveRuntimeSettings,
} from "@/lib/settings";
import type {
  FinalDecision,
  MeetingReport,
  MeetingRoleInput,
} from "@/types/meeting";
import type { MeetingRuntimeSettings } from "@/types/settings";
import { MeetingLoading } from "./meeting-loading";
import { MeetingRoom } from "./meeting-room";
import { PrepHall } from "./prep-hall";
import { SettingsButton } from "./settings-button";
import { SettingsModal } from "./settings-modal";

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
  settings: MeetingRuntimeSettings;
  rounds: MeetingRound[];
}

export function CouncilStage() {
  const [isDiscussing, setIsDiscussing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [runtimeSettings, setRuntimeSettings] = useState<MeetingRuntimeSettings>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_RUNTIME_SETTINGS;
    }
    return readRuntimeSettings();
  });
  const [sessionData, setSessionData] = useState<MeetingSessionData | null>(null);

  async function handleStartMeeting(input: {
    topic: string;
    roles: MeetingRoleInput[];
  }) {
    try {
      setErrorMessage("");
      setCurrentTopic(input.topic);
      setIsStarting(true);

      const result = await startMeetingRequest({
        topic: input.topic,
        roles: input.roles,
        settings: runtimeSettings,
      });

      setSessionData({
        topic: input.topic,
        roles: input.roles,
        settings: runtimeSettings,
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
      settings: sessionData.settings,
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

  function handleSaveSettings(settings: MeetingRuntimeSettings) {
    setRuntimeSettings(settings);
    saveRuntimeSettings(settings);
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <SettingsButton onClick={() => setSettingsOpen(true)} />
      </div>

      <AnimatePresence mode="wait">
        {isStarting ? (
          <MeetingLoading key="loading" topic={currentTopic} />
        ) : isDiscussing && sessionData ? (
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

      <SettingsModal
        open={settingsOpen}
        initialSettings={runtimeSettings}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </>
  );
}


