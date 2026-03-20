"use client";

import { motion } from "framer-motion";

export function MeetingLoading({ topic }: { topic: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 text-sm uppercase tracking-[0.22em] text-white/38"
      >
        AI Council 正在启动
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-4 text-2xl font-semibold text-white"
      >
        正在召集各方角色进入会议
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.72 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl text-sm leading-7 text-white/58"
      >
        议题：{topic}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-10 w-full max-w-xl"
      >
        <div className="mb-3 flex items-center justify-between text-xs text-white/42">
          <span>会议准备中</span>
          <span>正在建立首轮发言顺序</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-cyan-400/80"
            initial={{ width: "0%" }}
            animate={{ width: ["18%", "42%", "63%", "78%"] }}
            transition={{ 
              duration: 3.2, 
              repeat: Infinity, 
              repeatType: "reverse", 
              ease: "easeInOut", 
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="mt-8 space-y-2 text-xs text-white/36"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ delay: 0.6 }}
      >
        <p>· 正在载入角色立场与议题上下文</p>
        <p>· 第一个角色完成判断后将立即进入会议室正文</p>
      </motion.div>
    </div>
  );
}
