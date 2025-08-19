"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldDisplay from "../FieldDisplay";
import FieldErrorMessage from "./FieldErrorMessage";
import { X } from "lucide-react";
import IconButton from "../IconButton";

type LatLngLiteral = { lat: () => number; lng: () => number };
type PlaceResultLike = {
  formatted_address?: string;
  name?: string;
  geometry?: { location: LatLngLiteral };
  place_id?: string;
};

interface PlacesAutoCompleteInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: PlaceResultLike) => void;
  isEditing: boolean;
  error?: string | null;
  placeholder?: string;
  showLabel?: boolean;
}

const DEBOUNCE_MS = 250;

/** --- Types for Google Places Autocomplete v1 --- */
type StructuredText = { text: string };
type StructuredFormat = {
  mainText?: StructuredText;
  secondaryText?: StructuredText;
};

type PlacePrediction = {
  placeId: string;
  structuredFormat?: StructuredFormat;
};

type AutocompleteSuggestion = {
  placePrediction: PlacePrediction;
};

type AutocompleteResponse = {
  suggestions?: AutocompleteSuggestion[];
};

type PlaceDetailsResponse = {
  id?: string;
  formattedAddress?: string;
  displayName?: { text?: string };
  location?: { latitude?: number; longitude?: number };
};
/** ---------------------------------------------- */

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function newSessionToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>(() =>
    newSessionToken()
  );
  const [suggestions, setSuggestions] = useState<
    { placeId: string; mainText: string; secondaryText?: string }[]
  >([]);

  // Prevents re-open after programmatic selection
  const suppressNextFetchRef = useRef(false);
  // Remember the exact string we set from a selection
  const selectedTextRef = useRef<string | null>(null);

  const debounced = useDebounced(value, DEBOUNCE_MS);

  const closeList = () => {
    setOpen(false);
    setSuggestions([]);
  };

  useEffect(() => {
    if (!isEditing) return;

    // Skip one cycle after selection (onChange was programmatic)
    if (suppressNextFetchRef.current) {
      suppressNextFetchRef.current = false;
      closeList();
      return;
    }

    // If value equals last selected text, do not fetch/open
    if (selectedTextRef.current && debounced === selectedTextRef.current) {
      closeList();
      return;
    }

    // Only fetch when input is focused (user context)
    if (document.activeElement !== inputRef.current) {
      closeList();
      return;
    }

    const q = debounced?.trim();
    if (!q) {
      closeList();
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const resp = await fetch(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
              "X-Goog-FieldMask":
                "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat",
            },
            body: JSON.stringify({
              input: q,
              includedPrimaryTypes: [
                "street_address",
                "premise",
                "route",
                "postal_code",
              ],
              sessionToken,
            }),
          }
        );

        const data = (await resp.json()) as AutocompleteResponse;

        const items =
          data?.suggestions
            ?.map((s) => s.placePrediction)
            .filter((p): p is PlacePrediction => Boolean(p))
            .map((p) => ({
              placeId: p.placeId,
              mainText: p.structuredFormat?.mainText?.text ?? "",
              secondaryText: p.structuredFormat?.secondaryText?.text ?? "",
            })) ?? [];

        setSuggestions(items);
        // Open list if results exist
        if (items.length > 0) setOpen(true);
      } catch {
        closeList();
      } finally {
        setLoading(false);
      }
    })();
  }, [debounced, isEditing, sessionToken]);

  async function handleSelect(placeId: string) {
    suppressNextFetchRef.current = true;
    closeList();

    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
      placeId
    )}?sessionToken=${encodeURIComponent(sessionToken)}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        "X-Goog-FieldMask": "id,formattedAddress,displayName,location",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Place Details error", resp.status, text);
      return;
    }

    const details = (await resp.json()) as PlaceDetailsResponse;

    const lat = details?.location?.latitude ?? null;
    const lng = details?.location?.longitude ?? null;

    const placeResultLike: PlaceResultLike = {
      place_id: details?.id,
      formatted_address: details?.formattedAddress,
      name: details?.displayName?.text,
      geometry:
        lat != null && lng != null
          ? { location: { lat: () => lat, lng: () => lng } }
          : undefined,
    };

    if (details?.formattedAddress) {
      selectedTextRef.current = details.formattedAddress; // remember selected text
      onChange(details.formattedAddress); // programmatic change
    }
    onPlaceSelected?.(placeResultLike);

    setSessionToken(newSessionToken());
  }

  if (!isEditing) {
    return <FieldDisplay label={label} value={value} fallback="—" />;
  }

  return (
    <div className="relative">
      {showLabel && <Label>{label}</Label>}

      <Input
        ref={inputRef}
        value={value}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        onChange={(e) => {
          // user typing => clear selectedText; allow suggestions to open
          selectedTextRef.current = null;
          onChange(e.target.value);
          if (!open) setOpen(true);
        }}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
        spellCheck={false}
        onBlur={() => {
          // If you prefer to allow click without onMouseDown, you could delay:
          // setTimeout(closeList, 100);
          closeList();
        }}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="places-listbox"
      />

      {value && (
        <IconButton
          icon={<X size={20} />}
          type="button"
          onClick={() => {
            selectedTextRef.current = null;
            onChange("");
            closeList();
            setSessionToken(newSessionToken());
          }}
          aria-label="Clear"
          title="Clear"
          className="border-none absolute right-1 -top-[1px] text-grayCustom hover:text-white hover:bg-transparent"
        />
      )}

      {open && suggestions.length > 0 && (
        <div
          id="places-listbox"
          className="absolute z-50 mt-1 w-full rounded-xl border border-grayCustom bg-background2 text-zinc-100 shadow-2xl ring-1 ring-black/5 overflow-hidden"
          role="listbox"
        >
          {suggestions.map((s) => (
            <button
              key={s.placeId}
              type="button"
              // Use onMouseDown so it fires before the input blurs
              onMouseDown={() => handleSelect(s.placeId)}
              className="w-full text-left px-3 py-2 hover:bg-zinc-800/80 focus:bg-zinc-800/80 outline-none"
              role="option"
              aria-selected={false} // required by a11y rule; set true if you track active item
            >
              <div className="text-sm">{s.mainText}</div>
              {s.secondaryText && (
                <div className="text-xs text-zinc-400">{s.secondaryText}</div>
              )}
            </button>
          ))}
          {loading && (
            <div className="px-3 py-2 text-xs text-zinc-500">Loading…</div>
          )}
        </div>
      )}

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledPlacesAutocomplete;
