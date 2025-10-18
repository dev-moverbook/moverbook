"use client";

import React, { useMemo, useState } from "react";
import { Option } from "@/types/types";
import AdaptiveSelectTrigger from "./AdaptiveSelectTrigger";
import AdaptiveSelectMobile from "./AdaptiveSelectMobile";
import AdaptiveSelectDesktop from "./AdaptiveSelectDesktop";
import { useMediaQuery } from "react-responsive";
import { MOBILE_BREAKPOINT } from "@/types/const";

export interface AdaptiveSelectProps {
  allIcon?: React.ReactNode;
  allLabel?: string;
  className?: string;
  description: string;
  disabled?: boolean;
  emptyText?: string;
  onChange: (value: string | null) => void;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  showAllOption?: boolean;
  showSearch?: boolean;
  title?: string;
  triggerLabel?: string;
  value?: string | null;
}

export default function AdaptiveSelect({
  allIcon,
  allLabel,
  className,
  description,
  disabled,
  emptyText = "No results found.",
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search…",
  showAllOption = true,
  showSearch = true,
  title = "Select an option",
  triggerLabel,
  value,
}: AdaptiveSelectProps) {
  const isMobileViewport = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const shouldShowAllOption = showAllOption && !!allLabel?.trim();

  const displayedOptions: Option[] = useMemo(
    () =>
      shouldShowAllOption
        ? [{ value: null, label: allLabel! }, ...options]
        : options,
    [shouldShowAllOption, allLabel, options]
  );

  const effectiveValue = useMemo<string | null>(
    () => (shouldShowAllOption ? (value ?? null) : (value ?? null)),
    [shouldShowAllOption, value]
  );

  const selectedOption = useMemo(
    () =>
      displayedOptions.find((option) => option.value === effectiveValue) ??
      null,
    [displayedOptions, effectiveValue]
  );

  const handleSelect = (nextValue: string | null) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return isMobileViewport ? (
    <>
      <AdaptiveSelectTrigger
        className={className}
        disabled={disabled}
        onOpen={() => setIsOpen(true)}
        open={isOpen}
        placeholder={placeholder}
        selectedOption={selectedOption}
        title={title}
        triggerLabel={triggerLabel}
      />
      <AdaptiveSelectMobile
        allIcon={allIcon}
        description={description}
        emptyText={emptyText}
        onChange={handleSelect}
        open={isOpen}
        options={displayedOptions}
        searchPlaceholder={searchPlaceholder}
        setOpen={setIsOpen}
        showSearch={showSearch}
        title={title}
        value={effectiveValue}
      />
    </>
  ) : (
    <AdaptiveSelectDesktop
      allIcon={allIcon}
      className={className}
      disabled={disabled}
      emptyText={emptyText}
      onChange={handleSelect}
      open={isOpen}
      options={displayedOptions}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      selectedOption={selectedOption}
      setOpen={setIsOpen}
      title={title}
      value={effectiveValue}
      showSearch={showSearch}
      triggerLabel={triggerLabel}
    />
  );
}
