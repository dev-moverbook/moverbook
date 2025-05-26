"use client";

import React from "react";

interface FormActionContainerProps {
  children: React.ReactNode;
  className?: string;
}

const FormActionContainer: React.FC<FormActionContainerProps> = ({
  children,
  className = "",
}) => {
  return <div className={`pt-10 ${className}`}>{children}</div>;
};

export default FormActionContainer;
