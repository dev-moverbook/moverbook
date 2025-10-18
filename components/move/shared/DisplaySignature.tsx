"use client";

import Image from "next/image";
import { formatDateShort } from "@/frontendUtils/helper";

interface DisplaySignatureProps {
  image: string;
  timestamp: number;
  alt: string;
  title: string;
}

const DisplaySignature = ({
  image,
  timestamp,
  alt,
  title,
}: DisplaySignatureProps) => {
  const formattedDate = formatDateShort(timestamp);

  return (
    <div className="flex flex-col items-start gap-2">
      <h3 className="text-lg font-medium ">{title}</h3>
      <div className="relative w-full h-40 border border-grayCustom rounded shadow-xl shadow-white/10">
        <Image src={image} alt={alt} fill className="object-contain rounded" />
      </div>
      <p className="text-grayCustom2 text-sm">Signed on {formattedDate}</p>
    </div>
  );
};

export default DisplaySignature;
