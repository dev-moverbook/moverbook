"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly,
}) => {
  const safeValue = value ?? 0;

  return (
    <div className="flex gap-1 bg-black  rounded w-full">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-10 h-10 transition-colors ${
            readOnly ? "cursor-default" : "cursor-pointer"
          } ${i <= safeValue ? "text-greenCustom" : "text-grayCustom"}`}
          onClick={() => {
            if (!readOnly && onChange) onChange(i);
          }}
          fill={i <= safeValue ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

export default StarRating;
