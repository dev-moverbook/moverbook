import FieldDisplay from "../../shared/field/FieldDisplay";
import CounterInput from "../../shared/labeled/CounterInput";
import FieldErrorMessage from "../../shared/labeled/FieldErrorMessage";
import TagLabel from "../../shared/labeled/TagLabel";
import TruckSelector from "./TruckSelector";

interface EditableTruckFieldProps {
  value: number;
  onChange: (val: number) => void;
  tagType: "suggested" | "custom";
  setTagType: (val: "suggested" | "custom") => void;
  isEditing: boolean;
  error?: string;
}

const EditableTruckField: React.FC<EditableTruckFieldProps> = ({
  value,
  onChange,
  tagType,
  setTagType,
  isEditing,
  error,
}) => {
  if (!isEditing) {
    const trucksDisplay = `${value} ${value === 1 ? "Truck" : "Trucks"}`;

    return <FieldDisplay label="Trucks" value={trucksDisplay} fallback="N/A" />;
  }

  return (
    <div>
      <TagLabel
        label="Trucks"
        buttonText={tagType === "suggested" ? "Custom" : "Suggested"}
        onToggle={() =>
          setTagType(tagType === "suggested" ? "custom" : "suggested")
        }
      />
      {tagType === "suggested" ? (
        <TruckSelector
          value={value}
          onChange={(val: number | "custom") => onChange(val as number)}
          recommendedValue={2}
          warningValue={1}
        />
      ) : (
        <CounterInput
          value={value}
          onChange={onChange}
          min={1}
          max={10}
          isEditingProp={true}
        />
      )}
      <FieldErrorMessage error={error} noPlaceholder={true} />
    </div>
  );
};

export default EditableTruckField;
