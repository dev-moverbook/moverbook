import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useEffect } from "react";
import FieldErrorMessage from "./labeled/FieldErrorMessage";

interface PlacesAutoCompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  showLabel?: boolean;
  error?: string | null;
}

export const PlacesAutoCompleteInput: React.FC<
  PlacesAutoCompleteInputProps
> = ({ value, onChange, onPlaceSelected, showLabel = true, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: ["formatted_address", "geometry", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
      if (onPlaceSelected) onPlaceSelected(place);
    });
  }, [onChange, onPlaceSelected]);

  return (
    <div className="">
      {showLabel && <Label>Address</Label>}
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing address..."
        // className="w-full rounded-md border border-grayCustom bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        type="text"
      />
      <FieldErrorMessage error={error} />
    </div>
  );
};
