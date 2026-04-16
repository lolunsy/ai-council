"use client";

import { ArrowLeft, Crown, Radio, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ROLE_LIBRARY } from "@/data/roles";
import { generateJudgeDecision, generateRoleReport } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CouncilRole } from "@/types/council";
import type {
  FinalDecision,
  MeetingReport,
  MeetingRoleInput,
} from "@/types/meeting";
import type { MeetingRuntimeSettings } from "@/types/settings";
import { ModeratorPanel } from "./moderator-panel";
import { ReportCard } from "./report-card";

interface MeetingRound {
  id: string;
  topic: string;
  followUp?: string;
  reports: MeetingReport[];
  finalDecision?: FinalDecision | null;
}

interface MeetingRoomProps {
  topic: string;
  roles: MeetingRoleInput[];
  roleProfiles: CouncilRole[];
  rounds: MeetingRound[];
  settings: MeetingRuntimeSettings;
  onBack: () => void;
  onFollowUp: (message: string) => void | Promise<void>;
  onRoundGenerated: (round: MeetingRound) => void;
}

type ArchiveEntryKind = "report" | "decision" | "note";

interface ArchiveEntry {
  id: string;
  roundId: string;
  roundIndex: number;
  kind: ArchiveEntryKind;
  roleId: string;
  role: CouncilRole;
  speaker: string;
  badge: string;
  title: string;
  summary: string;
  content: string;
  reasoning: string;
}

const JUDGE_PROFILE: CouncilRole = {
  id: "ceo",
  name: "Judge",
  title: "裁判长 / 最终裁决核心",
  bias: "strategy",
  description: "负责整合所有意见并给出最终裁决。",
  avatar: "👑",
  color: "from-cyan-500/24 via-sky-400/10 to-transparent",
};

const COMMANDER_PROFILE: CouncilRole = {
  id: "commander",
  name: "Commander",
  title: "最高指挥官 / 强制介入源",
  bias: "strategy",
  description: "提供中途追加条件并强制推进下一轮推演。",
  avatar: "🛰️",
  color: "from-amber-500/24 via-orange-400/10 to-transparent",
};

function summarizeText(text: string, limit = 72) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "暂无摘要";
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit)}...`;
}

function composeDisplayMarkdown(entry: ArchiveEntry | null) {
  if (!entry) return "";

  if (entry.kind === "note") {
    return `## 指挥官追加条件\n\n${entry.content}`;
  }

  return entry.reasoning.trim()
    ? `${entry.content.trim()}\n\n${entry.reasoning.trim()}`
    : entry.content.trim();
}

export function MeetingRoom({
  topic,
  roles,
  roleProfiles,
  rounds,
  settings,
  onBack,
  onFollowUp,
  onRoundGenerated,
}: MeetingRoomProps) {
  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(-1);
  const [currentPhase, setCurrentPhase] = useState("会议准备中");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const latestRound = rounds[rounds.length - 1];

  const participantProfiles = useMemo(
    () =>
      roles
        .map(
          (role) =>
            roleProfiles.find((item) => item.id === role.id) ??
            ROLE_LIBRARY.find((item) => item.id === role.id)
        )
        .filter((role): role is CouncilRole => Boolean(role)),
    [roleProfiles, roles]
  );

  const roleProfileMap = useMemo(
    () => new Map(participantProfiles.map((role) => [role.id, role])),
    [participantProfiles]
  );

  useEffect(() => {
    if (!latestRound) return;
    if (
      latestRound.reports.length > 0 ||
      latestRound.finalDecision ||
      isGenerating
    ) {
      return;
    }

    let cancelled = false;
    const roundId = latestRound.id;
    const roundFollowUp = latestRound.followUp;

    async function runRound() {
      try {
        setIsGenerating(true);

        const generatedReports: MeetingReport[] = [];

        for (let index = 0; index < roles.length; index += 1) {
          if (cancelled) return;

          const role = roles[index];
          setActiveRoleIndex(index);
          setCurrentPhase(`${role.name} 正在形成判断`);

          const report = await generateRoleReport({
            topic,
            role,
            followUp: roundFollowUp,
            settings,
          });

          if (cancelled) return;

          generatedReports.push(report);

          onRoundGenerated({
            id: roundId,
            topic,
            followUp: roundFollowUp,
            reports: [...generatedReports],
            finalDecision: null,
          });
        }

        if (cancelled) return;

        setActiveRoleIndex(roles.length);
        setCurrentPhase("裁判长正在综合裁决");

        const finalDecision = await generateJudgeDecision({
          topic,
          followUp: roundFollowUp,
          settings,
          reports: generatedReports.map((item) => ({
            speaker: item.speaker,
            content: item.content,
          })),
        });

        if (cancelled) return;

        onRoundGenerated({
          id: roundId,
          topic,
          followUp: roundFollowUp,
          reports: generatedReports,
          finalDecision,
        });

        setCurrentPhase("裁判长已完成总结，可继续强制介入");
      } catch (error) {
        setCurrentPhase(
          error instanceof Error ? error.message : "会议生成失败"
        );
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
          setActiveRoleIndex(-1);
        }
      }
    }

    runRound();

    return () => {
      cancelled = true;
    };
  }, [isGenerating, latestRound, onRoundGenerated, roles, settings, topic]);

  const archiveEntries = useMemo(() => {
    const entries: ArchiveEntry[] = [];

    rounds.forEach((round, roundIndex) => {
      if (round.followUp) {
        entries.push({
          id: `${round.id}-commander-note`,
          roundId: round.id,
          roundIndex,
          kind: "note",
          roleId: COMMANDER_PROFILE.id,
          role: COMMANDER_PROFILE,
          speaker: "Commander Override",
          badge: `Round ${String(roundIndex + 1).padStart(2, "0")} Note`,
          title: "最高指挥官强制介入",
          summary: summarizeText(round.followUp),
          content: round.followUp,
          reasoning: "",
        });
      }

      round.reports.forEach((report) => {
        const role =
          roleProfileMap.get(report.roleId) ??
          ROLE_LIBRARY.find((item) => item.id === report.roleId) ??
          JUDGE_PROFILE;

        entries.push({
          id: report.id,
          roundId: round.id,
          roundIndex,
          kind: "report",
          roleId: report.roleId,
          role,
          speaker: report.speaker,
          badge: `Round ${String(roundIndex + 1).padStart(2, "0")} Report`,
          title: role.title,
          summary: report.summary,
          content: report.content,
          reasoning: report.reasoning,
        });
      });

      if (round.finalDecision) {
        entries.push({
          id: `${round.id}-final-decision`,
          roundId: round.id,
          roundIndex,
          kind: "decision",
          roleId: JUDGE_PROFILE.id,
          role: JUDGE_PROFILE,
          speaker: round.finalDecision.speaker,
          badge: `Round ${String(roundIndex + 1).padStart(2, "0")} Decision`,
          title: "综合裁决与折中方案",
          summary: round.finalDecision.summary,
          content: round.finalDecision.content,
          reasoning: round.finalDecision.reasoning,
        });
      }
    });

    return entries;
  }, [roleProfileMap, rounds]);

  const latestArchiveEntry = archiveEntries[archiveEntries.length - 1] ?? null;

  useEffect(() => {
    if (!activeReportId) return;

    const exists = archiveEntries.some((entry) => entry.id === activeReportId);
    if (!exists) {
      setActiveReportId(null);
    }
  }, [activeReportId, archiveEntries]);

  const selectedEntry =
    (activeReportId
      ? archiveEntries.find((entry) => entry.id === activeReportId)
      : latestArchiveEntry) ?? null;

  const activeRoleId =
    activeRoleIndex >= 0 && activeRoleIndex < roles.length
      ? roles[activeRoleIndex]?.id
      : activeRoleIndex === roles.length
        ? JUDGE_PROFILE.id
        : null;

  const showParsingIndicator = isGenerating && activeReportId === null;
  const displayMarkdown = composeDisplayMarkdown(selectedEntry);
  const activeDisplayRole = selectedEntry?.role ?? JUDGE_PROFILE;

  async function handleModeratorSubmit(message: string) {
    await onFollowUp(message);
    setActiveReportId(null);
  }

  return (
    <main className="relative left-1/2 -my-8 flex h-[100svh] w-screen -translate-x-1/2 overflow-hidden bg-[#02060d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:46px_46px] opacity-25" />
      </div>

      <section className="relative flex min-w-0 flex-[0_0_70%] flex-col border-r border-white/8">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
            activeDisplayRole.color
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15),rgba(2,6,23,0.88)_70%)]" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-6 pb-[17rem] pt-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-100/78">
                <Sparkles className="h-3.5 w-3.5" />
                The Spotlight Display
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[0.08em] text-white md:text-4xl">
                Neural Nexus // 聚光主幕
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58 md:text-base">
                当前议题：{topic}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/55">
                {currentPhase}
              </div>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                返回备战厅
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {participantProfiles.map((role) => (
              <div
                key={role.id}
                className={cn(
                  "relative flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-black/20 px-3 py-2",
                  activeRoleId === role.id &&
                    "border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
                    role.color
                  )}
                />
                <span className="relative z-10 text-lg">{role.avatar}</span>
                <span className="relative z-10 text-sm text-white/75">
                  {role.name}
                </span>
              </div>
            ))}
          </div>

          <div className="relative mt-6 flex min-h-0 flex-1 overflow-hidden rounded-[36px] border border-white/10 bg-black/30 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute left-6 top-4 text-[8rem] leading-none text-white/8 md:text-[10rem]">
              {selectedEntry?.role.avatar ?? "◎"}
            </div>
            <div className="pointer-events-none absolute right-8 top-8 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/50">
              {selectedEntry?.kind === "decision" ? (
                <Crown className="h-3.5 w-3.5 text-cyan-100/80" />
              ) : selectedEntry?.kind === "report" ? (
                <Radio className="h-3.5 w-3.5 text-cyan-100/80" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-amber-100/80" />
              )}
              {selectedEntry?.badge ?? "Live Signal"}
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <div className="border-b border-white/8 px-6 py-5 md:px-8">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-2xl">
                    {selectedEntry?.role.avatar ?? "◎"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                      {selectedEntry?.title ?? "Awaiting consciousness stream"}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-[0.04em] text-white md:text-3xl">
                      {selectedEntry?.speaker ?? "等待首条历史记录载入"}
                    </h2>
                  </div>
                </div>

                <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 md:text-base">
                  {selectedEntry?.summary ??
                    "议事厅正在汇聚第一条意识流，左侧主幕会在内容生成后自动接入。"}
                </p>

                {showParsingIndicator ? (
                  <div className="mt-4 inline-flex animate-pulse items-center rounded-full border border-cyan-300/18 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100/80">
                    [ 正在解析意识流... ]
                  </div>
                ) : null}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-8">
                {selectedEntry ? (
                  <div className="prose prose-invert max-w-none prose-headings:mb-3 prose-headings:text-white prose-p:text-white/80 prose-li:text-white/76 prose-strong:text-white prose-blockquote:border-cyan-300/15 prose-blockquote:text-white/70 prose-table:block prose-table:w-full prose-table:overflow-x-auto prose-th:text-white prose-td:text-white/75">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {displayMarkdown}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-cyan-300/18 bg-cyan-400/10 text-4xl text-cyan-50 shadow-[0_0_36px_rgba(34,211,238,0.12)]">
                      ◎
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold tracking-[0.08em] text-white">
                      Spotlight standby
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 md:text-base">
                      当前还没有可展示的历史记录。系统会在第一条角色报告生成后自动将其投射到主幕。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6 md:px-8 lg:px-10">
          <ModeratorPanel
            onSubmit={handleModeratorSubmit}
            disabled={isGenerating || !latestRound?.finalDecision}
            statusText={
              isGenerating
                ? "当前意识流生成中，暂不可覆盖"
                : latestRound?.finalDecision
                  ? "发送后将启动下一轮强制介入会议"
                  : "等待当前裁决完成后才能强制介入"
            }
          />
        </div>
      </section>

      <aside className="relative flex min-w-[320px] flex-[0_0_30%] flex-col bg-black/38">
        <div className="border-b border-white/8 px-5 py-6">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/55">
            Chronological Archive
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-[0.08em] text-white">
            历史时间轴目录
          </h2>
          <p className="mt-2 text-sm leading-7 text-white/52">
            所有历史记录都以胶囊形式归档。点击任意节点，即可把它投到左侧主幕进行沉浸式阅读。
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
              {archiveEntries.length} Entries Archived
            </div>
            <button
              type="button"
              onClick={() => setActiveReportId(null)}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs transition",
                activeReportId === null
                  ? "border-cyan-300/22 bg-cyan-400/12 text-cyan-100/80"
                  : "border-white/10 bg-white/5 text-white/55 hover:border-white/18 hover:bg-white/10 hover:text-white/75"
              )}
            >
              Live View
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.35)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
          {rounds.map((round, roundIndex) => {
            const roundEntries = archiveEntries.filter(
              (entry) => entry.roundId === round.id
            );

            return (
              <div key={round.id} className="mb-5">
                <div className="mb-3 flex items-center gap-3 px-1">
                  <div className="h-px flex-1 bg-white/8" />
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/45">
                    Round {String(roundIndex + 1).padStart(2, "0")}
                  </div>
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                <div className="space-y-3">
                  {roundEntries.map((entry) => (
                    <ReportCard
                      key={entry.id}
                      speaker={entry.speaker}
                      summary={entry.summary}
                      badge={entry.badge}
                      role={entry.role}
                      kind={entry.kind}
                      isActive={selectedEntry?.id === entry.id}
                      isLive={
                        activeReportId === null && latestArchiveEntry?.id === entry.id
                      }
                      onSelect={() => setActiveReportId(entry.id)}
                    />
                  ))}

                  {round.id === latestRound?.id && isGenerating ? (
                    <div className="rounded-[24px] border border-dashed border-cyan-300/16 bg-cyan-400/[0.04] px-4 py-3 text-sm text-cyan-100/72">
                      正在写入新的意识流节点...
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}

          {archiveEntries.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.03] px-6 text-center">
              <p className="text-lg font-semibold text-white/78">
                时间轴正在等待首条记录
              </p>
              <p className="mt-3 text-sm leading-7 text-white/48">
                当角色报告开始生成后，这里会按时间顺序出现胶囊归档。
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </main>
  );
}
