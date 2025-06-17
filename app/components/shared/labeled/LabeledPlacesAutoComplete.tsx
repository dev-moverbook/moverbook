import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldDisplay from "../FieldDisplay";
import FieldErrorMessage from "./FieldErrorMessage";

interface PlacesAutoCompleteInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  isEditing: boolean;
  error?: string | null;
  placeholder?: string;
  showLabel?: boolean;
}

const LabeledPlacesAutocomplete: React.FC<PlacesAutoCompleteInputProps> = ({
  label = "Address",
  value,
  onChange,
  onPlaceSelected,
  isEditing,
  error,
  placeholder = "Start typing address...",
  showLabel = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current || !isEditing) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: ["formatted_address", "geometry", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
      if (onPlaceSelected) onPlaceSelected?.(place);
    });
  }, [isEditing]);

  if (!isEditing) {
    return <FieldDisplay label={label} value={value} fallback="—" />;
  }

  return (
    <div>
      {showLabel && <Label>{label}</Label>}
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="text"
      />
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledPlacesAutocomplete;
