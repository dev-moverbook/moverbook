"use client";

import { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import FieldErrorMessage from "./labeled/FieldErrorMessage";

/** Minimal runtime shape returned by Google's web component */
type AutocompletePlace = {
  formattedAddress?: string;
  location?: google.maps.LatLng | { lat: number; lng: number };
  id?: string;
  displayName?: string | { text: string };
  fetchFields: (opts: { fields: string[] }) => Promise<AutocompletePlace>;
};

/** Typed interface for the Places Web Component.
 *  NOTE: Don’t redeclare addEventListener signatures — use the DOM defaults. */
interface PlaceAutocompleteElement extends HTMLElement {
  value: string;
  placeholder?: string;
}

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
  const elRef = useRef<PlaceAutocompleteElement | null>(null);

  // keep latest callbacks without re-running the create-once effect
  const onChangeRef = useRef(onChange);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  useEffect(() => {
    onChangeRef.current = onChange;
    onPlaceSelectedRef.current = onPlaceSelected;
  }, [onChange, onPlaceSelected]);

  // Create the PlaceAutocompleteElement once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      // Ensure the Places library is loaded (v=weekly or later)
      await google.maps.importLibrary?.("places");

      if (!hostRef.current) return;

      const PlaceAutocompleteCtor = (
        google.maps.places as unknown as {
          PlaceAutocompleteElement: new () => PlaceAutocompleteElement;
        }
      ).PlaceAutocompleteElement;

      const el = new PlaceAutocompleteCtor();
      elRef.current = el;

      el.placeholder = "Start typing address...";

      // Input listener (use DOM's EventListener typing, refine inside)
      const onInput: EventListener = (e) => {
        const target = e.currentTarget as PlaceAutocompleteElement | null;
        const next = target?.value ?? "";
        onChangeRef.current(next);
      };

      // Place select listener (cast Event -> CustomEvent at point of use)
      const onPlaceSelect: EventListener = async (e) => {
        const ce = e as unknown as CustomEvent<{ place: AutocompletePlace }>;
        const place = ce.detail.place;
        const full = await place.fetchFields({
          fields: ["formattedAddress", "location", "id", "displayName"],
        });
        if (full.formattedAddress) onChangeRef.current(full.formattedAddress);
        onPlaceSelectedRef.current?.(
          full as unknown as google.maps.places.PlaceResult
        );
      };

      el.addEventListener("input", onInput);
      el.addEventListener("gmp-placeselect", onPlaceSelect);

      hostRef.current.appendChild(el);

      if (value) el.value = value;

      cleanup = () => {
        el.removeEventListener("input", onInput);
        el.removeEventListener("gmp-placeselect", onPlaceSelect);
        el.remove();
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

export default PlacesAutoCompleteInput;
