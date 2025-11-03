"use client";

import React, { useEffect, useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import LabeledInput from "@/components/shared/labeled/LabeledInput";
import LabeledRadio from "@/components/shared/labeled/LabeledRadio";
import LabeledCheckboxGroup from "@/components/shared/labeled/LabeledCheckboxGroup";
import Header3 from "@/components/shared/heading/Header3";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
import IconButton from "@/components/shared/buttons/IconButton";
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
import LabeledPlacesAutocomplete from "@/components/shared/labeled/LabeledPlacesAutoComplete";
import FormActions from "@/components/shared/buttons/FormActions";
import IconRow from "@/components/shared/buttons/IconRow";
import { cn } from "@/lib/utils";
import NumberInput from "@/components/shared/labeled/NumberInput";
import { Button } from "@/components/ui/button";

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
  onSaved?: (savedLocation: LocationInput, index: number) => void;
  onCancelAdd?: () => void;
  canEdit?: boolean;
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
  canEdit = true,
}: MoveAddressProps) => {
  const [isManualAddress, setIsManualAddress] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(canEdit && isAdding);
  const [formData, setFormData] = useState<LocationInput>(location);

  type AddressObj = {
    formattedAddress: string;
    placeId: string | null;
    location: { lat: number | null; lng: number | null };
  };

  const EMPTY_ADDR: AddressObj = {
    formattedAddress: "",
    placeId: null,
    location: { lat: null, lng: null },
  };

  const mergeAddress = (patch: Partial<AddressObj>) => {
    const current: AddressObj = (formData.address as AddressObj) ?? EMPTY_ADDR;
    const next: AddressObj = {
      ...current,
      ...patch,
      location: {
        ...current.location,
        ...(patch.location ?? {}),
      },
    };
    handleChange({ address: next });
  };

  useEffect(() => {
    setIsEditing(canEdit && isAdding);
  }, [isAdding, canEdit]);

  useEffect(() => {
    if (!isEditing) {
      setFormData(location);
    }
  }, [isEditing, location]);

  const handleChange = (partial: Partial<LocationInput>) => {
    if (!canEdit) {
      return;
    }
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
    if (!canEdit) return;
    updateLocation?.(index, formData);
    setIsEditing(false);
    onSaved?.(formData, index);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const showEditInput = canEdit && (isEditing || !showEditButton);

  const isComplete =
    !!location.address &&
    location.locationType !== null &&
    location.accessType !== null &&
    location.squareFootage !== null &&
    (location.locationRole !== "starting" || location.moveSize !== null);

  const headerButtons = !canEdit ? undefined : showEditButton ? (
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
        {location.locationRole === "stop" && removeLocation && (
          <IconButton
            icon={<Trash size={16} />}
            aria-label="Delete"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              removeLocation(index);
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
          if (!canEdit) return;
          removeLocation(index);
        }}
      />
    )
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <Header3
          wrapperClassName="pt-4 "
          isCompleted={isComplete}
          button={headerButtons}
          showCheckmark={canEdit}
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
          <div>
            <div className="flex justify-between items-center">
              <label className="font-medium">Address</label>
              {canEdit && (
                <Button
                  variant="link"
                  size="auto"
                  className="text-sm underline cursor-pointer"
                  type="button"
                  onClick={() => setIsManualAddress((prev) => !prev)}
                >
                  {isManualAddress ? "Use AutoComplete" : "Enter Manually"}
                </Button>
              )}
            </div>

            {isManualAddress ? (
              <LabeledInput
                value={
                  (formData.address as AddressObj | undefined)
                    ?.formattedAddress || ""
                }
                placeholder="eg. 123 Main St"
                onChange={(e) =>
                  mergeAddress({
                    formattedAddress: e.target.value,
                  })
                }
              />
            ) : (
              <LabeledPlacesAutocomplete
                value={
                  (formData.address as AddressObj | undefined)
                    ?.formattedAddress || ""
                }
                onChange={(text) => mergeAddress({ formattedAddress: text })}
                onPlaceSelected={(place) => {
                  mergeAddress({
                    formattedAddress:
                      place.formatted_address ||
                      (formData.address as AddressObj | undefined)
                        ?.formattedAddress ||
                      "",
                    placeId: place.place_id ?? null,
                    location: place.geometry?.location
                      ? {
                          lat: place.geometry.location.lat(),
                          lng: place.geometry.location.lng(),
                        }
                      : { lat: null, lng: null },
                  });
                }}
                isEditing={true}
                showLabel={false}
              />
            )}
          </div>
        )}

        {!showEditInput && (
          <FieldDisplay
            label="Address"
            value={
              (formData.address as AddressObj | undefined)?.formattedAddress
            }
            fallback="—"
          />
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
          spellCheck={false}
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

        {showEditButton && isEditing && canEdit && (
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
