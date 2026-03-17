import { AppShell } from "@/components/layout/app-shell";
import { CouncilStage } from "@/components/council/council-stage";

export default function HomePage() {
  return (
    <AppShell>
      <CouncilStage />
    </AppShell>
  );
}
