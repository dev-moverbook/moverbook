"use client";

import React from "react";
import clsx from "clsx";

interface Header4Props {
  children: React.ReactNode;
  className?: string;
}

const Header4: React.FC<Header4Props> = ({ children, className }) => {
  return (
    <h4 className={clsx("text-white text-2xl font-medium", className)}>
      {children}
    </h4>
  );
};

export default Header4;
