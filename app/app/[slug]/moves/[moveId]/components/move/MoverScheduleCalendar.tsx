"use client";

import SectionHeader from "@/app/components/shared/SectionHeader";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { MoverCalendarProvider } from "@/app/contexts/MoverCalendarContext";
import MoverScheduleContent from "./MoverScheduleContent";

interface MoverScheduleCalendarProps {
  allMovers: Doc<"users">[];
}

const MoverScheduleCalendar = ({ allMovers }: MoverScheduleCalendarProps) => {
  return (
    <div>
      <SectionHeader className="mx-auto" title="Mover Schedule" />
      <MoverCalendarProvider allMovers={allMovers}>
        <MoverScheduleContent />
      </MoverCalendarProvider>
    </div>
  );
};

export default MoverScheduleCalendar;
