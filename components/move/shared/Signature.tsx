"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import IconButton from "../../shared/buttons/IconButton";
import { X, ChevronDown, ChevronRight } from "lucide-react";

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void;
  title: string;
  collapsible?: boolean;
}

const SignaturePad = ({
  title,
  onChange,
  collapsible = false,
}: SignaturePadProps) => {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState<boolean>(false);

  // Default to closed if collapsible, otherwise open
  const [isOpen, setIsOpen] = useState<boolean>(!collapsible);

  const clearSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    sigCanvasRef.current?.clear();
    setHasSignature(false);
    onChange(null);
  };

  const handleEnd = () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setHasSignature(false);
      onChange(null);
      return;
    }

    setHasSignature(true);
    const dataUrl = sigCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    onChange(dataUrl);
  };

  return (
    <div>
      <div
        className={`flex justify-between items-center mb-2 ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {/* Collapse icon to the left of the title */}

          <h3 className="text-lg font-medium">{title}</h3>
          {collapsible &&
            (isOpen ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            ))}
        </div>

        {hasSignature && (
          <IconButton
            variant="outline"
            icon={<X className="w-4 h-4" />}
            onClick={clearSignature}
            title="Clear"
          />
        )}
      </div>

      {isOpen && (
        <div className="flex flex-col items-center gap-4 py-1">
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="white"
            onEnd={handleEnd}
            canvasProps={{
              className:
                "w-full h-40 bg-background2 rounded border border-grayCustom shadow-xl shadow-white/10",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
