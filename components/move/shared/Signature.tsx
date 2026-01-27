"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import IconButton from "../../shared/buttons/IconButton";
import { X } from "lucide-react";

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void;
  title: string;
}

const SignaturePad = ({ title, onChange }: SignaturePadProps) => {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  const clearSignature = () => {
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
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">{title}</h3>

        {hasSignature && (
          <IconButton
            variant="outline"
            icon={<X className="w-4 h-4" />}
            onClick={clearSignature}
            title="Clear"
          />
        )}
      </div>

      <div className="flex flex-col items-center gap-4  py-1 rounded-lg shadow-md">
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
    </div>
  );
};

export default SignaturePad;
