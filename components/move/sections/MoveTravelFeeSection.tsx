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
  originalTravelFeeRate?: number | null;
  originalTravelFeeMethod?: TravelChargingTypes | null;

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
  originalTravelFeeRate,
  originalTravelFeeMethod,
  handleTravelFeeRateChange,
  handleTravelFeeMethodChange,
  isEditing = false,
  setIsEditing,
}) => {
  const editingMode = isAdd || isEditing;

  const currentMethod = travelFeeMethod ?? null;
  const currentRate = travelFeeRate ?? null;
  const origMethod = originalTravelFeeMethod ?? null;
  const origRate = originalTravelFeeRate ?? null;

  const methodRequiresRate = currentMethod !== null;

  const isValid =
    !methodRequiresRate || (currentRate !== null && currentRate > 0);

  const hasChanges = currentMethod !== origMethod || currentRate !== origRate;

  const canSave = editingMode && (isAdd || hasChanges) && isValid;

  const handleToggle = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing?.(true);
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    const success = await onSave?.();
    if (success) {
      setIsEditing?.(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setIsEditing?.(false);
  };

  const rateLabel =
    travelFeeMethod === TravelChargingTypes.MILEAGE
      ? "Mileage Rate ($/mile)"
      : travelFeeMethod === TravelChargingTypes.FLAT
        ? "Flat Rate ($)"
        : travelFeeMethod === TravelChargingTypes.LABOR_HOURS
          ? "Labor Rate ($/hour)"
          : "";

  const showRateInput = rateLabel !== "";

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
          value={travelFeeMethod ?? "None"}
          options={TRAVEL_FEE_METHOD_OPTIONS}
          onChange={(value) =>
            handleTravelFeeMethodChange(value as TravelChargingTypes | "None")
          }
          label="Method"
          isEditing={editingMode}
        />

        {showRateInput && (
          <CurrencyInput
            label={rateLabel}
            value={travelFeeRate ?? null}
            onChange={handleTravelFeeRateChange}
            isEditing={editingMode}
            suffix={
              travelFeeMethod === TravelChargingTypes.MILEAGE
                ? "/mile"
                : travelFeeMethod === TravelChargingTypes.FLAT
                  ? ""
                  : "/hr"
            }
          />
        )}

        {editingMode && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={handleCancel}
            isSaving={isSaving}
            error={updateError}
            disabled={!canSave}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveTravelFeeSection;
