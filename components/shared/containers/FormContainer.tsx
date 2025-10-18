import React from "react";
import { cn } from "@/lib/utils";

interface FormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <form
      className={cn(
        "flex flex-col w-full max-w-screen-sm mx-auto pb-10",
        className
      )}
      {...props}
    >
      {children}
    </form>
  );
};

export default FormContainer;
