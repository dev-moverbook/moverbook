"use client";

import { CompleteCardInfo } from "@/types/types";

interface SavedCardOptionProps {
  cardInfo: CompleteCardInfo;
  selected: boolean;
  onSelect: () => void;
}

export function SavedCardOption({
  cardInfo,
  selected,
  onSelect,
}: SavedCardOptionProps) {
  return (
    <label className="flex gap-3 cursor-pointer">
      <input type="radio" checked={selected} onChange={onSelect} />
      <div>
        <div className="font-medium">Use saved card</div>
        <div className="text-sm text-gray-600">
          {cardInfo.brand} •••• {cardInfo.last4} (exp {cardInfo.expMonth}/
          {cardInfo.expYear})
        </div>
      </div>
    </label>
  );
}
