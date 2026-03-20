"use client";

import { motion } from "framer-motion";

export function MeetingLoading({ topic }: { topic: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-sm uppercase tracking-[0.2em] text-white/40"
      >
        AI Council 正在启动
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 text-2xl font-semibold text-white"
      >
        正在召集各方角色参与会议
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.4 }}
        className="max-w-xl text-sm text-white/60"
      >
        议题：{topic}
      </motion.p>

      <motion.div
        className="mt-10 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 delay-150" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 delay-300" />
      </motion.div>

      <motion.p
        className="mt-6 text-xs text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8 }}
      >
        正在分析议题、构建观点与推演逻辑...
      </motion.p>
    </div>
  );
}