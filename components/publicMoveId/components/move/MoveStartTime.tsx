"use client";

import Header3 from "@/components/shared/heading/Header3";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
import { formatDateTimeLocal } from "@/frontendUtils/helper";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { formatBreakTime } from "@/frontendUtils/luxonUtils";

const MoveTimes = () => {
  const { move } = usePublicMoveIdContext();
  const { actualStartTime, actualArrivalTime, actualEndTime, actualBreakTime } =
    move.move;

  const hasAnyData = Boolean(
    actualStartTime || actualArrivalTime || actualEndTime
  );

  const isMoveCompleted = Boolean(
    actualStartTime && actualArrivalTime && actualEndTime
  );

  return (
    <div>
      <Header3 wrapperClassName="pt-0" isCompleted={isMoveCompleted}>
        Times
      </Header3>

      <SectionContainer>
        {!hasAnyData ? (
          <p className="text-gray-500 italic text-sm py-2">
            Timing details will be listed here once the move is underway.
          </p>
        ) : (
          <>
            {actualStartTime && (
              <FieldDisplay
                label="Start Time"
                value={formatDateTimeLocal(actualStartTime)}
              />
            )}
            {actualArrivalTime && (
              <FieldDisplay
                label="Arrival Time"
                value={formatDateTimeLocal(actualArrivalTime)}
              />
            )}
            {actualEndTime && (
              <>
                <FieldDisplay
                  label="End Time"
                  value={formatDateTimeLocal(actualEndTime)}
                />
                <FieldDisplay
                  label="Break Time"
                  value={formatBreakTime(actualBreakTime)}
                />
              </>
            )}
          </>
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveTimes;
