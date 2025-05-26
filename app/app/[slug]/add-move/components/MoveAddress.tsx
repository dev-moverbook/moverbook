import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import {
  ACCESS_TYPE_OPTIONS,
  AccessType,
  MOVE_TYPE_OPTIONS,
  MoveType,
} from "@/types/types";
import React from "react";

interface MoveAddressProps {
  title: string;
  completed?: boolean;
}

const MoveAddress = ({ title, completed }: MoveAddressProps) => {
  const {
    moveType,
    setMoveType,
    aptUnitSuite,
    setAptUnitSuite,
    aptUnitSuiteError,
    setAptUnitSuiteError,
    aptBuildingName,
    setAptBuildingName,
    aptBuildingNameError,
    setAptBuildingNameError,
    squareFootage,
    setSquareFootage,
    squareFootageError,
    setSquareFootageError,
    access,
    setAccess,
  } = useMoveForm();
  return (
    <SectionContainer>
      <h4>{title}</h4>
      <div>
        <LabeledRadio
          label="Move Type"
          name="moveType"
          value={moveType}
          onChange={(value) => {
            setMoveType(value as MoveType);
          }}
          options={MOVE_TYPE_OPTIONS}
        />
        <LabeledInput
          label="Apt/Unit/Suite"
          value={aptUnitSuite}
          placeholder="eg. 1, A2"
          onChange={(e) => {
            setAptUnitSuite(e.target.value);
            setAptUnitSuiteError(null);
          }}
          error={aptUnitSuiteError}
        />
        <LabeledInput
          label="Apartment / Building Name"
          value={aptBuildingName}
          placeholder="eg. Avalon Apartments"
          onChange={(e) => {
            setAptBuildingName(e.target.value);
            setAptBuildingNameError(null);
          }}
          error={aptBuildingNameError}
        />
        <LabeledInput
          label="Square Footage"
          value={squareFootage}
          placeholder="Square Footage"
          onChange={(e) => {
            setSquareFootage(e.target.value);
            setSquareFootageError(null);
          }}
          error={squareFootageError}
          type="number"
        />
        <LabeledRadio
          label="Access"
          name="access"
          value={access}
          onChange={(value) => {
            setAccess(value as AccessType);
          }}
          options={ACCESS_TYPE_OPTIONS}
        />
      </div>
    </SectionContainer>
  );
};

export default MoveAddress;
