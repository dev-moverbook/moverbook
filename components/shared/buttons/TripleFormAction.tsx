"use client";

import FormErrorMessage from "../error/FormErrorMessage";
import { cn } from "@/lib/utils";

interface TripleFormActionProps {
  children: [React.ReactNode, React.ReactNode, React.ReactNode];
  error?: string | null;
  className?: string;
}

const TripleFormAction: React.FC<TripleFormActionProps> = ({
  children,
  error,
  className,
}) => {
  return (
    <div
      className={cn(
        "max-w-screen-sm mx-auto md:px-0 px-4 mt-4 w-full",
        className
      )}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="w-full flex">{children[0]}</div>
        <div className="w-full flex">{children[1]}</div>
        <div className="w-full flex">{children[2]}</div>
      </div>
      <FormErrorMessage className="text-center" message={error} />
    </div>
  );
};

export default TripleFormAction;
