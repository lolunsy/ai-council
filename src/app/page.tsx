import { AppShell } from "@/components/layout/app-shell";
import { MeetingRoom } from "@/components/council/meeting-room";

export default function HomePage() {
  return (
    <AppShell>
      <MeetingRoom />
    </AppShell>
  );
}
