"use client";

import React, { useEffect, useMemo, useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import FormActions from "../../shared/FormActions";
import BreakTimeInput from "../../shared/labeled/BreakTimeInput";
import {
  splitDecimalHours,
  combineToDecimalHours,
} from "@/app/frontendUtils/timeUtils";

interface BreakMoveSectionProps {
  isSaving?: boolean;
  updateError?: string | null;
  onCancel?: () => void;
  breakMoveTime?: number | null;
  handleChangeBreakTime: (value: number) => Promise<void> | void;
}

const BreakMoveSection: React.FC<BreakMoveSectionProps> = ({
  isSaving = false,
  updateError,
  onCancel,
  handleChangeBreakTime,
  breakMoveTime,
}) => {
  const serverDecimalHours = useMemo(
    () => (typeof breakMoveTime === "number" ? breakMoveTime : 0),
    [breakMoveTime]
  );

  const { hours: serverHours, minutes: serverMinutes } =
    splitDecimalHours(serverDecimalHours);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hoursLocal, setHoursLocal] = useState<number>(serverHours);
  const [minutesLocal, setMinutesLocal] = useState<number>(serverMinutes);

  useEffect(() => {
    if (!isEditing) {
      setHoursLocal(serverHours);
      setMinutesLocal(serverMinutes);
    }
  }, [isEditing, serverHours, serverMinutes]);

  const handleSave = async () => {
    const newDecimal = combineToDecimalHours(hoursLocal, minutesLocal);
    if (newDecimal !== serverDecimalHours) {
      await handleChangeBreakTime(newDecimal);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setHoursLocal(serverHours);
    setMinutesLocal(serverMinutes);
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <div>
      <Header3
        showCheckmark={false}
        button={
          <EditToggleButton
            isEditing={isEditing}
            onToggle={() => setIsEditing((prev) => !prev)}
          />
        }
      >
        Break Time
      </Header3>

      <SectionContainer>
        <BreakTimeInput
          isEditing={isEditing}
          hours={hoursLocal}
          minutes={minutesLocal}
          onHoursChange={setHoursLocal}
          onMinutesChange={setMinutesLocal}
        />

        {isEditing ? (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              void handleSave();
            }}
            onCancel={handleCancel}
            isSaving={isSaving}
            error={updateError}
            saveLabel="Save"
            cancelLabel="Cancel"
          />
        ) : null}
      </SectionContainer>
    </div>
  );
};

export default BreakMoveSection;
