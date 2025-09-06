// components/move/schedule/MoverScheduleCalendar.tsx
"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { MoverCalendarProvider } from "@/app/contexts/MoverCalendarContext";
import MoverScheduleContent from "./MoverScheduleContent";
import CollapsibleSection from "@/app/components/shared/buttons/CollapsibleSection";

interface MoverScheduleCalendarProps {
  allMovers: Doc<"users">[];
  defaultOpen?: boolean;
}

const MoverScheduleCalendar = ({
  allMovers,
  defaultOpen = true,
}: MoverScheduleCalendarProps) => {
  return (
    <CollapsibleSection
      title="Mover Schedule"
      defaultOpen={defaultOpen}
      toggleLabels={{ open: "Hide", closed: "View" }}
      className="max-w-screen-sm mx-auto"
      headerClassName="px-4 md:px-0"
    >
      <MoverCalendarProvider allMovers={allMovers}>
        <MoverScheduleContent />
      </MoverCalendarProvider>
    </CollapsibleSection>
  );
};

export default MoverScheduleCalendar;
