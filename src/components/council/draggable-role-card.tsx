"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent } from "react";
import type { CouncilRole } from "@/types/council";
import { cn } from "@/lib/utils";

interface DraggableRoleCardProps {
  role: CouncilRole;
  disabled?: boolean;
  overlay?: boolean;
}

function getRoleGlow(role: CouncilRole) {
  if (role.id.startsWith("custom-")) {
    if (role.color.includes("amber") || role.color.includes("orange")) {
      return "rgba(251, 191, 36, 0.3)";
    }
    if (role.color.includes("fuchsia") || role.color.includes("violet")) {
      return "rgba(192, 132, 252, 0.28)";
    }
    if (role.color.includes("emerald") || role.color.includes("teal")) {
      return "rgba(45, 212, 191, 0.28)";
    }
    return "rgba(34, 211, 238, 0.32)";
  }

  if (role.color.includes("emerald")) return "rgba(16, 185, 129, 0.28)";
  if (role.color.includes("sky")) return "rgba(56, 189, 248, 0.28)";
  if (role.color.includes("violet")) return "rgba(168, 85, 247, 0.26)";
  if (role.color.includes("rose")) return "rgba(244, 63, 94, 0.26)";
  if (role.color.includes("amber")) return "rgba(251, 191, 36, 0.28)";
  if (role.color.includes("cyan")) return "rgba(34, 211, 238, 0.28)";
  return "rgba(255, 255, 255, 0.16)";
}

function getBiasLabel(role: CouncilRole) {
  if (role.id.startsWith("custom-")) return "CUSTOM";
  return role.bias.toUpperCase();
}

export function DraggableRoleCard({
  role,
  disabled = false,
  overlay = false,
}: DraggableRoleCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: role.id,
    data: {
      type: "role",
      roleId: role.id,
    },
    disabled: disabled || overlay,
  });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const tiltX = useSpring(rotateX, { stiffness: 220, damping: 20, mass: 0.65 });
  const tiltY = useSpring(rotateY, { stiffness: 220, damping: 20, mass: 0.65 });

  const glow = getRoleGlow(role);
  const restingShadow = disabled
    ? "0 18px 42px rgba(0,0,0,0.2)"
    : `0 20px 48px rgba(0,0,0,0.3), 0 0 0 rgba(0,0,0,0), 0 0 0 ${glow}`;
  const hoverShadow = `0 28px 70px rgba(0,0,0,0.34), 0 0 36px ${glow}`;
  const overlayShadow = `0 30px 90px rgba(0,0,0,0.38), 0 0 44px ${glow}`;

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (disabled || overlay) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateY.set(((offsetX - centerX) / centerX) * 6);
    rotateX.set(-((offsetY - centerY) / centerY) * 6);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.button
      ref={overlay ? undefined : setNodeRef}
      type="button"
      disabled={disabled}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerUp={resetTilt}
      {...(!overlay ? listeners : {})}
      {...(overlay ? { tabIndex: -1 } : attributes)}
      initial={false}
      animate={
        overlay
          ? { boxShadow: overlayShadow, rotateX: 6, rotateY: -8, y: -10 }
          : { boxShadow: restingShadow, y: 0, scale: 1 }
      }
      whileHover={
        disabled || overlay
          ? undefined
          : {
              y: -10,
              scale: 1.01,
              boxShadow: hoverShadow,
            }
      }
      transition={{ type: "spring", stiffness: 240, damping: 18, mass: 0.7 }}
      style={{
        rotateX: overlay ? undefined : tiltX,
        rotateY: overlay ? undefined : tiltY,
      }}
      className={cn(
        "group relative h-full min-h-[190px] w-[220px] shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl [transform-style:preserve-3d]",
        "transition-colors duration-300",
        overlay &&
          "cursor-grabbing border-cyan-300/35 bg-white/[0.08] ring-1 ring-cyan-300/15",
        disabled &&
          "cursor-not-allowed border-white/6 bg-white/[0.03] text-white/55"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-85",
          role.color
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />

      {isDragging && !overlay ? (
        <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/12 bg-black/30 opacity-60 shadow-[0_0_24px_rgba(255,255,255,0.05)]" />
      ) : null}

      <div
        className={cn(
          "relative z-10 flex h-full flex-col",
          isDragging && !overlay && "opacity-45"
        )}
      >
        <div className="flex items-start gap-4 [transform:translateZ(28px)]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-black/25 text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
            {role.avatar}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-white">
                {role.name}
              </h3>
              <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/75">
                {getBiasLabel(role)}
              </span>
            </div>

            <p className="mt-1 text-sm text-white/85">{role.title}</p>
          </div>
        </div>

        <div className="mt-4 flex-1 rounded-[22px] border border-white/8 bg-black/14 p-3 [transform:translateZ(18px)]">
          <p className="line-clamp-4 text-xs leading-6 text-white/68">
            {role.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 [transform:translateZ(30px)]">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">
            {overlay ? "drag signal" : "holo card"}
          </div>

          {disabled ? (
            <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/60">
              已入席
            </div>
          ) : (
            <div className="inline-flex rounded-full border border-cyan-300/18 bg-cyan-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-100/82">
              Drag to Deploy
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
