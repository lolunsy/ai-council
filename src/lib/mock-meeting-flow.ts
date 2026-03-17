export function getMeetingStatusText(
  visibleCount: number,
  totalCount: number
) {
  if (visibleCount <= 0) {
    return "会议准备中";
  }

  if (visibleCount < totalCount) {
    return `正在推进第 ${visibleCount} 段会议内容`;
  }

  return "裁判长已完成总结，可继续追问";
}

