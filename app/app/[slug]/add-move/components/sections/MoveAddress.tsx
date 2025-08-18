// MoveAddress.tsx
import React, { useEffect, useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import LabeledCheckboxGroup from "@/app/components/shared/labeled/LabeledCheckboxGroup";
import Header3 from "@/app/components/shared/heading/Header3";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, Trash, X } from "lucide-react";
import {
  ACCESS_TYPE_OPTIONS,
  MOVE_SIZE_OPTIONS,
  AccessType,
  MoveSize,
  StopBehavior,
  TIME_DISTANCE_OPTIONS,
  TimeDistanceRange,
  STOP_BEHAVIOR_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  LocationType,
} from "@/types/types";
import { LocationInput } from "@/types/form-types";
import LabeledPlacesAutocomplete from "@/app/components/shared/labeled/LabeledPlacesAutoComplete";
import FormActions from "@/app/components/shared/FormActions";
import IconRow from "@/app/components/shared/IconRow";
import { cn } from "@/lib/utils";
import NumberInput from "@/app/components/shared/labeled/NumberInput";
import { Button } from "@/app/components/ui/button";

interface MoveAddressProps {
  title: string;
  index: number;
  location: LocationInput;
  updateLocation?: (index: number, partial: Partial<LocationInput>) => void;
  removeLocation?: (index: number) => void;
  showEditButton?: boolean;
  isLoading?: boolean;
  error?: string | null;
  isAdding?: boolean;
  onSaved?: () => void;
  onCancelAdd?: () => void;
}

const MoveAddress = ({
  title,
  index,
  location,
  updateLocation,
  removeLocation,
  showEditButton,
  isLoading,
  error,
  isAdding = false,
  onSaved,
}: MoveAddressProps) => {
  const [isManualAddress, setIsManualAddress] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(isAdding);
  const [formData, setFormData] = useState<LocationInput>(location);

  useEffect(() => {
    if (isAdding) setIsEditing(true);
  }, [isAdding]);

  useEffect(() => {
    if (!isEditing) {
      setFormData(location);
    }
  }, [isEditing, location]);

  const handleChange = (partial: Partial<LocationInput>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    if (isAdding) {
      updateLocation?.(index, partial);
      return;
    }
    if (showEditButton) {
      return;
    }
    updateLocation?.(index, partial);
  };

  const handleSave = () => {
    updateLocation?.(index, formData);
    setIsEditing(false);
    onSaved?.();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const showEditInput = isEditing || !showEditButton;

  const isComplete =
    !!location.address &&
    location.locationType !== null &&
    location.accessType !== null &&
    location.squareFootage !== null &&
    (location.locationRole !== "starting" || location.moveSize !== null);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Header3
          wrapperClassName="pt-4 "
          isCompleted={isComplete}
          button={
            showEditButton ? (
              isEditing ? (
                <IconButton
                  icon={<X size={16} />}
                  aria-label="Cancel Edit"
                  onClick={handleCancel}
                  className="border border-grayCustom"
                />
              ) : (
                <IconRow>
                  <IconButton
                    icon={<Pencil size={16} />}
                    aria-label="Edit"
                    onClick={() => setIsEditing(true)}
                  />
                  {location.locationRole === "stop" && (
                    <IconButton
                      icon={<Trash size={16} />}
                      aria-label="Delete"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        removeLocation?.(index);
                      }}
                    />
                  )}
                </IconRow>
              )
            ) : (
              removeLocation && (
                <IconButton
                  icon={<Trash size={16} />}
                  aria-label="Delete"
                  onClick={(e) => {
                    e.preventDefault();
                    removeLocation(index);
                  }}
                />
              )
            )
          }
        >
          {title}
        </Header3>
      </div>

      <SectionContainer className={cn("", isEditing && "gap-0")}>
        <LabeledRadio
          label="Location Type"
          name={`locationType-${index}`}
          value={formData.locationType || ""}
          onChange={(value) =>
            handleChange({ locationType: value as LocationType })
          }
          options={LOCATION_TYPE_OPTIONS}
          isEditing={showEditInput}
        />

        {showEditInput && (
          <div className="">
            <div className="flex justify-between items-center">
              <label className="font-medium">Address</label>
              <Button
                variant="link"
                size="auto"
                className="text-sm underline cursor-pointer"
                type="button"
                onClick={() => setIsManualAddress((prev) => !prev)}
              >
                {isManualAddress ? "Use AutoComplete" : "Enter Manually"}
              </Button>
            </div>

            {isManualAddress ? (
              <LabeledInput
                value={formData.address || ""}
                placeholder="eg. 123 Main St"
                onChange={(e) => handleChange({ address: e.target.value })}
              />
            ) : (
              <LabeledPlacesAutocomplete
                value={formData.address || ""}
                onChange={(value) => handleChange({ address: value })}
                isEditing={true}
                showLabel={false}
              />
            )}
          </div>
        )}

        {!showEditInput && (
          <FieldDisplay label="Address" value={formData.address} fallback="—" />
        )}

        <LabeledInput
          label="Apt/Unit/Suite"
          value={formData.aptNumber || ""}
          placeholder="eg. 1, A2"
          onChange={(e) => handleChange({ aptNumber: e.target.value })}
          isEditing={showEditInput}
        />
        <LabeledInput
          label="Apartment / Building Name"
          value={formData.aptName || ""}
          placeholder="eg. Avalon Apartments"
          onChange={(e) => handleChange({ aptName: e.target.value })}
          isEditing={showEditInput}
        />
        <NumberInput
          label="Square Footage"
          value={formData.squareFootage || null}
          onChange={(value) => handleChange({ squareFootage: value })}
          isEditing={showEditInput}
          placeholder="Square Footage"
          unit="sq ft"
        />
        {formData.locationRole !== "ending" && (
          <LabeledRadio
            label="Move Size"
            name={`moveSize-${index}`}
            value={formData.moveSize || ""}
            onChange={(value) => handleChange({ moveSize: value as MoveSize })}
            options={MOVE_SIZE_OPTIONS}
            isEditing={showEditInput}
          />
        )}
        <LabeledRadio
          label="Access"
          name={`access-${index}`}
          value={formData.accessType || ""}
          onChange={(value) =>
            handleChange({ accessType: value as AccessType })
          }
          options={ACCESS_TYPE_OPTIONS}
          isEditing={showEditInput}
        />
        {formData.locationRole === "stop" && (
          <LabeledCheckboxGroup
            label="Stop Behavior"
            name="stopBehavior"
            values={formData.stopBehavior ?? []}
            options={STOP_BEHAVIOR_OPTIONS}
            onChange={(selected) => {
              const validValues = selected.filter(
                (val): val is StopBehavior =>
                  val === "pick_up" || val === "drop_off"
              );
              handleChange({
                stopBehavior: validValues.length > 0 ? validValues : undefined,
              });
            }}
            isEditing={showEditInput}
          />
        )}
        <LabeledRadio
          label="Time Distance Range"
          name="timeDistanceRange"
          value={formData.timeDistanceRange}
          options={TIME_DISTANCE_OPTIONS}
          isEditing={showEditInput}
          onChange={(val) =>
            handleChange({ timeDistanceRange: val as TimeDistanceRange })
          }
        />
        {showEditButton && isEditing && (
          <FormActions
            onSave={handleSave}
            onCancel={handleCancel}
            saveLabel="Save"
            cancelLabel="Cancel"
            isSaving={isLoading}
            error={error}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveAddress;
