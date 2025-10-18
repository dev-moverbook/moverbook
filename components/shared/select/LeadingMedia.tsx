"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type LeadingMediaProps = {
  isAll: boolean;
  allIcon?: React.ReactNode;
  image?: string;
  altText?: string;
  sizeClassName?: string;
  className?: string;
};

export default function LeadingMedia({
  isAll,
  allIcon,
  image,
  altText,
  sizeClassName = "h-8 w-8",
  className,
}: LeadingMediaProps) {
  if (isAll && allIcon) {
    return (
      <span
        className={cn(
          sizeClassName,
          "flex items-center justify-center flex-shrink-0",
          className
        )}
      >
        {allIcon}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full overflow-hidden",
        sizeClassName,
        className
      )}
    >
      <Image
        src={image as string}
        alt={altText ?? ""}
        fill
        className="object-cover"
        sizes="32px"
        priority={false}
      />
    </div>
  );
}
