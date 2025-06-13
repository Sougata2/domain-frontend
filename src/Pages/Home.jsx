import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";

export default function Home() {
  return (
    <div className="flex flex-col gap-3.5">
      <SectionCards />
      <ChartAreaInteractive />
    </div>
  );
}
