import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import {
  ACCESS_TYPE_OPTIONS,
  MOVE_TYPE_OPTIONS,
  AccessType,
  MoveType,
  MoveSize,
  MOVE_SIZE_OPTIONS,
} from "@/types/types";
import React, { useState } from "react";
import { LocationInput } from "@/types/form-types";
import { Button } from "@/app/components/ui/button";
import { PlacesAutoCompleteInput } from "@/app/components/shared/PlacesAutoCompleteInput";
import Header3 from "@/app/components/shared/heading/Header3";

interface MoveAddressProps {
  title: string;
  index: number;
  location: LocationInput;
}

const MoveAddress = ({ title, index, location }: MoveAddressProps) => {
  const { updateLocation, removeLocation } = useMoveForm();
  const [isManualAddress, setIsManualAddress] = useState<boolean>(false);

  const isComplete =
    !!location.address &&
    !!location.squareFootage &&
    !!location.moveType &&
    !!location.moveSize &&
    !!location.accessType;

  return (
    <SectionContainer className="pt-4 md:pt-0">
      <div className="flex justify-between items-center">
        <Header3 isCompleted={isComplete}>{title}</Header3>
        {index > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeLocation(index)}
          >
            Delete
          </Button>
        )}
      </div>
      <div>
        <LabeledRadio
          label="Move Type"
          name={`moveType-${index}`}
          value={location.moveType || ""}
          onChange={(value) =>
            updateLocation(index, { moveType: value as MoveType })
          }
          options={MOVE_TYPE_OPTIONS}
        />
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Address</label>
          <p
            className="text-sm  underline cursor-pointer"
            onClick={() => setIsManualAddress((prev) => !prev)}
          >
            {isManualAddress ? "Use AutoComplete" : "Enter Manually"}
          </p>
        </div>
        {isManualAddress ? (
          <LabeledInput
            value={location.address || ""}
            placeholder="eg. 123 Main St"
            onChange={(e) => updateLocation(index, { address: e.target.value })}
          />
        ) : (
          <PlacesAutoCompleteInput
            value={location.address || ""}
            onChange={(value) => updateLocation(index, { address: value })}
            showLabel={false}
          />
        )}

        <LabeledInput
          label="Apt/Unit/Suite"
          value={location.aptNumber || ""}
          placeholder="eg. 1, A2"
          onChange={(e) => updateLocation(index, { aptNumber: e.target.value })}
        />
        <LabeledInput
          label="Apartment / Building Name"
          value={location.aptName || ""}
          placeholder="eg. Avalon Apartments"
          onChange={(e) => updateLocation(index, { aptName: e.target.value })}
        />
        <LabeledInput
          label="Square Footage"
          value={location.squareFootage?.toString() || ""}
          placeholder="Square Footage"
          onChange={(e) =>
            updateLocation(index, { squareFootage: Number(e.target.value) })
          }
          type="number"
        />
        <LabeledRadio
          label="Move Size"
          name={`moveSize-${index}`}
          value={location.moveSize || ""}
          onChange={(value) =>
            updateLocation(index, { moveSize: value as MoveSize })
          }
          options={MOVE_SIZE_OPTIONS}
        />
        <LabeledRadio
          label="Access"
          name={`access-${index}`}
          value={location.accessType || ""}
          onChange={(value) =>
            updateLocation(index, { accessType: value as AccessType })
          }
          options={ACCESS_TYPE_OPTIONS}
        />
      </div>
    </SectionContainer>
  );
};

export default MoveAddress;
