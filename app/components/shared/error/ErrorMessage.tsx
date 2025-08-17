import React from "react";

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "An unexpected error occurred.",
  className = "",
}) => {
  return (
    <div className={`flex justify-center mt-6 ${className}`}>
      <div className="text-red-500 text-center">{message}</div>
    </div>
  );
};

export default ErrorMessage;
