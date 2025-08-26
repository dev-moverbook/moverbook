"use client";

import React, { useEffect, useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import CounterInput from "../../shared/labeled/CounterInput";

interface BreakMoveSectionProps {
  isSaving?: boolean;
  updateError?: string | null;
  onCancel?: () => void;
  handleChangeBreakTime: (value: number) => Promise<void> | void;
  breakMoveTime?: number | null;
  onSave: () => Promise<void> | void;
}

const BreakMoveSection: React.FC<BreakMoveSectionProps> = ({
  isSaving = false,
  updateError,
  onCancel,
  handleChangeBreakTime,
  breakMoveTime,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const showEditButton = isEditing;

  return (
    <div>
      <Header3
        showCheckmark={false}
        button={
          showEditButton && (
            <EditToggleButton
              isEditing={isEditing}
              onToggle={() => setIsEditing((v) => !v)}
            />
          )
        }
      >
        Break Time
      </Header3>
      <SectionContainer>
        <div className="flex gap-12">
          <CounterInput
            label="Hours"
            value={breakMoveTime ?? 0}
            onChange={(value) => handleChangeBreakTime(value)}
            min={0}
          />
          <CounterInput
            label="Minutes"
            value={breakMoveTime ?? 0}
            onChange={(value) => handleChangeBreakTime(value)}
            min={0}
            max={59}
          />
        </div>
      </SectionContainer>
    </div>
  );
};

export default BreakMoveSection;
