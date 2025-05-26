"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import clsx from "clsx";

interface CounterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const CounterInput: React.FC<CounterInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  className,
}) => {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <Label className="text-white text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={decrement}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="min-w-[60px] px-4 py-1 text-center text-white border border-gray-500 rounded-xl text-lg">
          {value}
        </div>
        <button
          type="button"
          onClick={increment}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CounterInput;
