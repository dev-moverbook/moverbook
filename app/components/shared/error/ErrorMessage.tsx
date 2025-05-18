import React from "react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  return (
    <div className={`flex justify-center mt-6 ${className}`}>
      <div className="text-red-500 text-center">Error: {message}</div>
    </div>
  );
};

export default ErrorMessage;
