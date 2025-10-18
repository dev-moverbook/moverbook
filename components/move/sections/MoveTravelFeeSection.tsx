"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import FormActions from "@/components/shared/buttons/FormActions";
import CurrencyInput from "../../shared/labeled/CurrencyInput";
import { TravelChargingTypes } from "@/types/enums";
import ButtonRadioGroup from "../../shared/labeled/ButtonRadioGroup";
import { TRAVEL_FEE_METHOD_OPTIONS } from "@/types/types";

interface MoveTravelFeeProps {
  isAdd?: boolean;
  isSaving?: boolean;
  updateError?: string | null;
  onSave?: () => Promise<boolean>;
  onCancel?: () => void;
  travelFeeRate?: number | null;
  travelFeeMethod?: TravelChargingTypes | null;
  handleTravelFeeRateChange: (value: number | null) => void;
  handleTravelFeeMethodChange: (value: TravelChargingTypes | "None") => void;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

const MoveTravelFeeSection: React.FC<MoveTravelFeeProps> = ({
  isAdd = false,
  isSaving = false,
  updateError,
  onSave,
  onCancel,
  travelFeeRate,
  travelFeeMethod,
  handleTravelFeeRateChange,
  handleTravelFeeMethodChange,
  isEditing = false,
  setIsEditing,
}) => {
  const editingMode = isAdd || isEditing;

  const handleToggle = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing?.(true);
    }
  };

  const handleSave = async () => {
    const success = await onSave?.();
    if (success) {
      setIsEditing?.(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const rateLabel: string =
    travelFeeMethod === TravelChargingTypes.MILEAGE
      ? "Mileage Rate ($/mile)"
      : travelFeeMethod === TravelChargingTypes.FLAT
        ? "Flat Rate ($)"
        : travelFeeMethod === TravelChargingTypes.LABOR_HOURS
          ? "Labor Rate ($/hour)"
          : "";

  const showRate = rateLabel !== "";

  return (
    <div>
      <Header3
        showCheckmark={false}
        button={
          !isAdd && (
            <EditToggleButton isEditing={isEditing} onToggle={handleToggle} />
          )
        }
      >
        Travel Fee
      </Header3>

      <SectionContainer>
        <ButtonRadioGroup
          name="travelFeeMethod"
          value={travelFeeMethod ?? "None"} // 👈 show "none" if null
          options={TRAVEL_FEE_METHOD_OPTIONS}
          onChange={(value) => {
            handleTravelFeeMethodChange(value as TravelChargingTypes | "None");
          }}
          label="Method"
          isEditing={editingMode}
        />

        {showRate && (
          <CurrencyInput
            label={rateLabel}
            value={travelFeeRate ?? null}
            onChange={handleTravelFeeRateChange}
            isEditing={editingMode}
            error={updateError}
            suffix={
              travelFeeMethod === TravelChargingTypes.MILEAGE
                ? "/mile"
                : travelFeeMethod === TravelChargingTypes.FLAT
                  ? ""
                  : "/hr"
            }
          />
        )}

        {isEditing && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={handleCancel}
            isSaving={isSaving}
            error={updateError}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveTravelFeeSection;
