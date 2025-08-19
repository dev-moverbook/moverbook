// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRef, useEffect } from "react";
// import FieldErrorMessage from "./labeled/FieldErrorMessage";

// interface PlacesAutoCompleteInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
//   showLabel?: boolean;
//   error?: string | null;
// }

// export const PlacesAutoCompleteInput: React.FC<
//   PlacesAutoCompleteInputProps
// > = ({ value, onChange, onPlaceSelected, showLabel = true, error }) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!inputRef.current) return;

//     const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
//       types: ["address"],
//       fields: ["formatted_address", "geometry", "name"],
//     });

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();
//       if (place.formatted_address) {
//         onChange(place.formatted_address);
//       }
//       if (onPlaceSelected) onPlaceSelected(place);
//     });
//   }, [onChange, onPlaceSelected]);

//   return (
//     <div className="">
//       {showLabel && <Label>Address</Label>}
//       <Input
//         ref={inputRef}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder="Start typing address..."
//         // className="w-full rounded-md border border-grayCustom bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//         type="text"
//       />
//       <FieldErrorMessage error={error} />
//     </div>
//   );
// };

// PlacesAutoCompleteInput.tsx
"use client";

import { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
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
  const hostRef = useRef<HTMLDivElement | null>(null);
  const elRef = useRef<any>(null); // PlaceAutocompleteElement instance

  // Create the PlaceAutocompleteElement once
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      // Ensure the Places library is loaded (v=weekly or later)
      // @ts-ignore
      await google.maps.importLibrary?.("places");

      if (!hostRef.current) return;

      const el = new (google.maps.places as any).PlaceAutocompleteElement();
      elRef.current = el;

      // Optional: set a placeholder
      el.placeholder = "Start typing address...";

      // Keep your component controlled
      el.addEventListener("input", (e: any) => {
        onChange(e?.target?.value ?? "");
      });

      // Fired when a prediction is selected
      el.addEventListener("gmp-placeselect", async (e: any) => {
        const place = e.detail.place;
        // Fetch the fields you need
        const full = await place.fetchFields({
          fields: ["formattedAddress", "location", "id", "displayName"],
        });
        if (full.formattedAddress) onChange(full.formattedAddress);
        onPlaceSelected?.(full);
      });

      hostRef.current.appendChild(el);

      // Initialize with current value
      if (value) el.value = value;

      cleanup = () => {
        el.remove(); // detach listeners + element
      };
    })();

    return cleanup;
  }, []); // create once

  // Keep element value in sync when parent value changes
  useEffect(() => {
    if (elRef.current && elRef.current.value !== value) {
      elRef.current.value = value ?? "";
    }
  }, [value]);

  return (
    <div>
      {showLabel && <Label>Address</Label>}
      {/* Google renders its own input inside this host */}
      <div ref={hostRef} />
      <FieldErrorMessage error={error} />
    </div>
  );
};
