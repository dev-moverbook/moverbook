"use client";

interface FormActionContainerProps {
  children: React.ReactNode;
  className?: string;
}

const FormActionContainer: React.FC<FormActionContainerProps> = ({
  children,
  className = "",
}) => {
  return <div className={` px-4 pb-6 ${className}`}>{children}</div>;
};

export default FormActionContainer;
