"use client";

import { motion } from "framer-motion";

interface ModeratorNoteCardProps {
  message: string;
}

export function ModeratorNoteCard({ message }: ModeratorNoteCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-[32px] border border-amber-300/18 bg-amber-400/[0.05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/12 to-amber-200/0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-amber-200/20" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-xl">
            🗣️
          </div>
          <div>
            <p className="text-lg font-semibold text-white">主持人补充信息</p>
            <p className="text-sm text-white/60">会议中途插入的新条件 / 追问</p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/8 bg-black/10 p-5">
          <p className="text-sm leading-7 text-white/80">{message}</p>
        </div>
      </div>
    </motion.article>
  );
}
