interface FormErrorMessageProps {
  message?: string | null;
  className?: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
  className = "",
}) => {
  return (
    <p className={`text-sm min-h-[1.5rem] text-red-500 pt-1 pl-1 ${className}`}>
      {message || ""}
    </p>
  );
};

export default FormErrorMessage;
