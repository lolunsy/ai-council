"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import {
  DEFAULT_RUNTIME_SETTINGS,
  readRuntimeSettings,
  saveRuntimeSettings,
} from "@/lib/settings";
import type { CouncilRole } from "@/types/council";
import type {
  FinalDecision,
  MeetingReport,
  MeetingRoleInput,
} from "@/types/meeting";
import type { MeetingRuntimeSettings } from "@/types/settings";
import { MeetingRoom } from "./meeting-room";
import { PrepHall } from "./prep-hall";
import { SettingsButton } from "./settings-button";
import { SettingsModal } from "./settings-modal";

interface MeetingRound {
  id: string;
  topic: string;
  followUp?: string;
  reports: MeetingReport[];
  finalDecision?: FinalDecision | null;
}

interface MeetingSessionData {
  topic: string;
  roles: MeetingRoleInput[];
  roleProfiles: CouncilRole[];
  settings: MeetingRuntimeSettings;
  rounds: MeetingRound[];
}

export function CouncilStage() {
  const [isDiscussing, setIsDiscussing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [runtimeSettings, setRuntimeSettings] = useState<MeetingRuntimeSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_RUNTIME_SETTINGS;
    return readRuntimeSettings();
  });
  const [sessionData, setSessionData] = useState<MeetingSessionData | null>(null);

  const handleStartMeeting = useCallback(
    async (input: {
      topic: string;
      roles: MeetingRoleInput[];
      roleProfiles: CouncilRole[];
    }) => {
      try {
        setErrorMessage("");
        setIsStarting(true);

        setSessionData({
          topic: input.topic,
          roles: input.roles,
          roleProfiles: input.roleProfiles,
          settings: runtimeSettings,
          rounds: [
            {
              id: `round-${Date.now()}`,
              topic: input.topic,
              reports: [],
              finalDecision: null,
            },
          ],
        });

        setIsDiscussing(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "启动会议失败");
      } finally {
        setIsStarting(false);
      }
    },
    [runtimeSettings]
  );

  const handleFollowUp = useCallback(async (message: string) => {
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
            reports: [],
            finalDecision: null,
          },
        ],
      };
    });
  }, []);

  const handleRoundGenerated = useCallback((round: MeetingRound) => {
    setSessionData((current) => {
      if (!current) return current;

      return {
        ...current,
        rounds: current.rounds.map((item) =>
          item.id === round.id ? round : item
        ),
      };
    });
  }, []);

  const handleSaveSettings = useCallback((settings: MeetingRuntimeSettings) => {
    setRuntimeSettings(settings);
    saveRuntimeSettings(settings);
  }, []);

  return (
    <>
      {!isDiscussing ? (
        <div className="mb-4 flex justify-end">
          <SettingsButton onClick={() => setSettingsOpen(true)} />
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {isDiscussing && sessionData ? (
          <MeetingRoom
            key="meeting-room"
            topic={sessionData.topic}
            roles={sessionData.roles}
            roleProfiles={sessionData.roleProfiles}
            rounds={sessionData.rounds}
            settings={sessionData.settings}
            onBack={() => setIsDiscussing(false)}
            onFollowUp={handleFollowUp}
            onRoundGenerated={handleRoundGenerated}
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
