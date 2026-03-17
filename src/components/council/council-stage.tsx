"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MeetingRoom } from "./meeting-room";
import { PrepHall } from "./prep-hall";

export function CouncilStage() {
  const [isDiscussing, setIsDiscussing] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isDiscussing ? (
        <MeetingRoom key="meeting-room" onBack={() => setIsDiscussing(false)} />
      ) : (
        <PrepHall key="prep-hall" onStartMeeting={() => setIsDiscussing(true)} />
      )}
    </AnimatePresence>
  );
}
