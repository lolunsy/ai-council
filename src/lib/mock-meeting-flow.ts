import type { MockReport } from "@/data/mock-meeting";

export function getMeetingStatusText(
  visibleCount: number,
  totalCount: number
) {
  if (visibleCount <= 0) {
    return "会议准备中";
  }

  if (visibleCount < totalCount) {
    return `正在听取第 ${visibleCount} 位角色发言`;
  }

  return "裁判长已完成总结，可继续追问";
}

export function getVisibleReports(
  reports: MockReport[],
  visibleCount: number
) {
  return reports.slice(0, visibleCount);
}
