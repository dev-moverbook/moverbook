// import SectionContainer from "@/app/components/shared/containers/SectionContainer";
// import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
// import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
// import { useMoveForm } from "@/app/contexts/MoveFormContext";
// import {
//   ACCESS_TYPE_OPTIONS,
//   MOVE_TYPE_OPTIONS,
//   AccessType,
//   MoveType,
//   MoveSize,
//   MOVE_SIZE_OPTIONS,
//   StopBehavior,
// } from "@/types/types";
// import React, { useState } from "react";
// import { LocationInput } from "@/types/form-types";
// import { Button } from "@/app/components/ui/button";
// import { PlacesAutoCompleteInput } from "@/app/components/shared/PlacesAutoCompleteInput";
// import Header3 from "@/app/components/shared/heading/Header3";
// import LabeledCheckboxGroup from "@/app/components/shared/labeled/LabeledCheckboxGroup";

// interface MoveAddressProps {
//   title: string;
//   index: number;
//   location: LocationInput;
// }

// const MoveAddress = ({ title, index, location }: MoveAddressProps) => {
//   const { updateLocation, removeLocation, locations, isLocationComplete } =
//     useMoveForm();
//   const [isManualAddress, setIsManualAddress] = useState<boolean>(false);

//   return (
//     <SectionContainer className="pt-4 md:pt-0">
//       <div className="flex justify-between items-center">
//         <Header3 isCompleted={isLocationComplete(index)}>{title}</Header3>
//         {index !== 0 && index !== locations.length - 1 && (
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={(e) => {
//               e.preventDefault();
//               removeLocation(index);
//             }}
//           >
//             Delete
//           </Button>
//         )}
//       </div>
//       <div>
//         <LabeledRadio
//           label="Move Type"
//           name={`moveType-${index}`}
//           value={location.moveType || ""}
//           onChange={(value) =>
//             updateLocation(index, { moveType: value as MoveType })
//           }
//           options={MOVE_TYPE_OPTIONS}
//         />
//         <div className="flex justify-between items-center mb-1">
//           <label className="text-sm font-medium">Address</label>
//           <p
//             className="text-sm  underline cursor-pointer"
//             onClick={() => setIsManualAddress((prev) => !prev)}
//           >
//             {isManualAddress ? "Use AutoComplete" : "Enter Manually"}
//           </p>
//         </div>
//         {isManualAddress ? (
//           <LabeledInput
//             value={location.address || ""}
//             placeholder="eg. 123 Main St"
//             onChange={(e) => updateLocation(index, { address: e.target.value })}
//           />
//         ) : (
//           <PlacesAutoCompleteInput
//             value={location.address || ""}
//             onChange={(value: string) =>
//               updateLocation(index, { address: value })
//             }
//             showLabel={false}
//           />
//         )}

//         <LabeledInput
//           label="Apt/Unit/Suite"
//           value={location.aptNumber || ""}
//           placeholder="eg. 1, A2"
//           onChange={(e) => updateLocation(index, { aptNumber: e.target.value })}
//         />
//         <LabeledInput
//           label="Apartment / Building Name"
//           value={location.aptName || ""}
//           placeholder="eg. Avalon Apartments"
//           onChange={(e) => updateLocation(index, { aptName: e.target.value })}
//         />
//         <LabeledInput
//           label="Square Footage"
//           value={location.squareFootage?.toString() || ""}
//           placeholder="Square Footage"
//           onChange={(e) =>
//             updateLocation(index, { squareFootage: Number(e.target.value) })
//           }
//           type="number"
//           min={0}
//         />
//         <LabeledRadio
//           label="Move Size"
//           name={`moveSize-${index}`}
//           value={location.moveSize || ""}
//           onChange={(value) =>
//             updateLocation(index, { moveSize: value as MoveSize })
//           }
//           options={MOVE_SIZE_OPTIONS}
//         />
//         <LabeledRadio
//           label="Access"
//           name={`access-${index}`}
//           value={location.accessType || ""}
//           onChange={(value) =>
//             updateLocation(index, { accessType: value as AccessType })
//           }
//           options={ACCESS_TYPE_OPTIONS}
//         />
//         {location.locationType === "stop" && (
//           <LabeledCheckboxGroup
//             label="Stop Behavior"
//             name="stopBehavior"
//             values={
//               location.stopBehavior === "both"
//                 ? ["pickup", "stop"]
//                 : location.stopBehavior
//                   ? [location.stopBehavior]
//                   : []
//             }
//             options={[
//               { label: "Pickup", value: "pickup" },
//               { label: "Drop", value: "stop" },
//             ]}
//             onChange={(selected) => {
//               let value: StopBehavior | undefined;
//               if (selected.includes("pickup") && selected.includes("stop")) {
//                 value = "both";
//               } else if (selected.includes("pickup")) {
//                 value = "pickup";
//               } else if (selected.includes("stop")) {
//                 value = "stop";
//               } else {
//                 value = undefined;
//               }
//               updateLocation(index, { stopBehavior: value });
//             }}
//           />
//         )}
//       </div>
//     </SectionContainer>
//   );
// };

// export default MoveAddress;

import React, { useEffect, useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import LabeledCheckboxGroup from "@/app/components/shared/labeled/LabeledCheckboxGroup";
import { Button } from "@/app/components/ui/button";
import Header3 from "@/app/components/shared/heading/Header3";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, Trash, X } from "lucide-react";
import {
  ACCESS_TYPE_OPTIONS,
  MOVE_TYPE_OPTIONS,
  MOVE_SIZE_OPTIONS,
  AccessType,
  MoveType,
  MoveSize,
  StopBehavior,
} from "@/types/types";
import { LocationInput } from "@/types/form-types";
import LabeledPlacesAutocomplete from "@/app/components/shared/labeled/LabeledPlacesAutoComplete";
import FormActions from "@/app/components/shared/FormActions";
import IconRow from "@/app/components/shared/IconRow";
import { cn } from "@/lib/utils";

interface MoveAddressProps {
  title: string;
  index: number;
  location: LocationInput;
  updateLocation?: (index: number, partial: Partial<LocationInput>) => void;
  removeLocation?: (index: number) => void;
  showEditButton?: boolean;
  isLoading?: boolean;
  error?: string | null;
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
}: MoveAddressProps) => {
  const [isManualAddress, setIsManualAddress] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<LocationInput>(location);

  useEffect(() => {
    if (!isEditing) {
      setFormData(location);
    }
  }, [isEditing, location]);

  const handleChange = (partial: Partial<LocationInput>) => {
    if (showEditButton) {
      setFormData((prev) => ({ ...prev, ...partial }));
    } else {
      updateLocation?.(index, partial);
    }
  };

  const handleSave = () => {
    updateLocation?.(index, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const showEditInput = isEditing || !showEditButton;

  return (
    <div>
      <div className="flex justify-between items-center">
        <Header3
          isCompleted={Boolean(location.address)}
          button={
            showEditButton &&
            (isEditing ? (
              <IconButton
                icon={<X size={16} />}
                aria-label="Cancel Edit"
                onClick={handleCancel}
              />
            ) : (
              <IconRow>
                <IconButton
                  icon={<Pencil size={16} />}
                  aria-label="Edit"
                  onClick={() => setIsEditing(true)}
                />
                {location.locationType === "stop" && (
                  <IconButton
                    icon={<Trash size={16} />}
                    aria-label="Delete"
                    onClick={(e) => {
                      e.preventDefault();
                      removeLocation?.(index);
                    }}
                  />
                )}
              </IconRow>
            ))
          }
        >
          {title}
        </Header3>

        {!showEditButton &&
          removeLocation &&
          index !== 0 &&
          index !== undefined && (
            <IconButton
              icon={<Trash size={16} />}
              aria-label="Delete"
              onClick={(e) => {
                e.preventDefault();
                removeLocation(index);
              }}
            />
          )}
      </div>

      <SectionContainer className={cn("", isEditing && "gap-0")}>
        <LabeledRadio
          label="Move Type"
          name={`moveType-${index}`}
          value={formData.moveType || ""}
          onChange={(value) => handleChange({ moveType: value as MoveType })}
          options={MOVE_TYPE_OPTIONS}
          isEditing={showEditInput}
        />

        {isEditing && (
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium">Address</label>
            <p
              className="text-sm underline cursor-pointer"
              onClick={() => setIsManualAddress((prev) => !prev)}
            >
              {isManualAddress ? "Use AutoComplete" : "Enter Manually"}
            </p>
          </div>
        )}

        {showEditInput ? (
          isManualAddress ? (
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
          )
        ) : (
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

        <LabeledInput
          label="Square Footage"
          value={formData.squareFootage?.toString() || ""}
          placeholder="Square Footage"
          onChange={(e) =>
            handleChange({ squareFootage: Number(e.target.value) })
          }
          type="number"
          min={0}
          isEditing={showEditInput}
        />

        <LabeledRadio
          label="Move Size"
          name={`moveSize-${index}`}
          value={formData.moveSize || ""}
          onChange={(value) => handleChange({ moveSize: value as MoveSize })}
          options={MOVE_SIZE_OPTIONS}
          isEditing={showEditInput}
        />

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

        {formData.locationType === "stop" && (
          <LabeledCheckboxGroup
            label="Stop Behavior"
            name="stopBehavior"
            values={
              formData.stopBehavior === "both"
                ? ["pickup", "stop"]
                : formData.stopBehavior
                  ? [formData.stopBehavior]
                  : []
            }
            options={[
              { label: "Pickup", value: "pickup" },
              { label: "Drop", value: "stop" },
            ]}
            onChange={(selected) => {
              let value: StopBehavior | undefined;
              if (selected.includes("pickup") && selected.includes("stop")) {
                value = "both";
              } else if (selected.includes("pickup")) {
                value = "pickup";
              } else if (selected.includes("stop")) {
                value = "stop";
              } else {
                value = undefined;
              }
              handleChange({ stopBehavior: value });
            }}
            isEditing={showEditInput}
          />
        )}

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
