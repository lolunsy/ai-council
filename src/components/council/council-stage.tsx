"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { generateRoleReport, generateJudgeDecision } from "@/lib/api";
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
  const [loadingTopic, setLoadingTopic] = useState<string>("");
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
      setIsStarting(true);
      setLoadingTopic(input.topic);

      const reports = await Promise.all(
        input.roles.map((role) =>
          generateRoleReport({
            topic: input.topic,
            role,
            settings: runtimeSettings,
          })
        )
      );

      const finalDecision = await generateJudgeDecision({
        topic: input.topic,
        settings: runtimeSettings,
        reports: reports.map((report) => ({
          speaker: report.speaker,
          content: report.content,
        })),
      });

      setSessionData({
        topic: input.topic,
        roles: input.roles,
        settings: runtimeSettings,
        rounds: [
          {
            id: `round-${Date.now()}`,
            topic: input.topic,
            reports,
            finalDecision,
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

    const reports = await Promise.all(
      sessionData.roles.map((role) =>
        generateRoleReport({
          topic: sessionData.topic,
          role,
          followUp: message,
          settings: sessionData.settings,
        })
      )
    );

    const finalDecision = await generateJudgeDecision({
      topic: sessionData.topic,
      followUp: message,
      settings: sessionData.settings,
      reports: reports.map((report) => ({
        speaker: report.speaker,
        content: report.content,
      })),
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
            reports,
            finalDecision,
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
          <MeetingLoading key="loading" topic={loadingTopic} />
        ) : isDiscussing && sessionData ? (
          <MeetingRoom
            key="meeting-room"
            topic={sessionData.topic}
            roles={sessionData.roles}
            settings={sessionData.settings}
            rounds={sessionData.rounds}
            onBack={() => setIsDiscussing(false)}
            onLoading={setIsStarting}
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


