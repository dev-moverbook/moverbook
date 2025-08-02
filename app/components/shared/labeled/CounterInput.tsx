"use client";

import React, { useRef, useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import FormErrorMessage from "../error/FormErrorMessage";

interface CounterInputProps {
  label?: string;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  error?: string | null;
  isEditingProp?: boolean;
}

const CounterInput: React.FC<CounterInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  className,
  error,
  isEditingProp = true,
}) => {
  const [isEditing, setIsEditing] = useState(isEditingProp);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus and select input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setInputValue(""); // Show empty field on edit
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const num = Number(val);
    if (!isNaN(num) && val !== "" && num >= min && num <= max) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setInputValue("");
  };

  const decrement = () => {
    if (value === null) {
      onChange(min);
    } else if (value > min) {
      onChange(value - 1);
    }
  };

  const increment = () => {
    if (value === null) {
      onChange(min);
    } else if (value < max) {
      onChange(value + 1);
    }
  };

  if (!isEditingProp) {
    return (
      <div className={clsx("flex flex-col gap-2", className)}>
        {label && (
          <Label className="text-white text-sm font-medium">{label}</Label>
        )}
        <div className="flex items-center gap-4">
          <div className="min-w-[60px] px-4 py-1 text-center text-white border border-grayCustom rounded-xl text-lg bg-transparent">
            {value ?? "-"}
          </div>
        </div>
        <FormErrorMessage message={error} />
      </div>
    );
  }
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {label && (
        <Label className="text-white text-sm font-medium">{label}</Label>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={decrement}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-grayCustom text-white shadow-sm transition duration-150 hover:bg-white/10 hover:scale-105 active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            min={min}
            max={max}
            className="min-w-[60px] w-[70px] px-2 py-1 text-center text-white border border-grayCustom rounded-xl text-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-greenCustom"
            inputMode="numeric"
            placeholder="" // No placeholder, field is empty on edit
            autoComplete="off"
          />
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={handleEdit}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") handleEdit();
            }}
            className="min-w-[60px] px-4 py-1 text-center text-white border border-grayCustom rounded-xl text-lg cursor-pointer hover:bg-white/10"
          >
            {value === null ? "-" : value}
          </div>
        )}
        <button
          type="button"
          onClick={increment}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-grayCustom text-white shadow-sm transition duration-150 hover:bg-white/10 hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <FormErrorMessage message={error} />
    </div>
  );
};

export default CounterInput;
