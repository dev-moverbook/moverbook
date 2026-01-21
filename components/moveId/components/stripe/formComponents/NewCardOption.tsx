"use client";

interface NewCardOptionProps {
  selected: boolean;
  onSelect: () => void;
}

export function NewCardOption({ selected, onSelect }: NewCardOptionProps) {
  return (
    <label className="flex gap-3 cursor-pointer">
      <input type="radio" checked={selected} onChange={onSelect} />
      <div>
        <div className="font-medium">Add new card</div>
        <div className="text-sm text-gray-600">Enter a new payment method</div>
      </div>
    </label>
  );
}
