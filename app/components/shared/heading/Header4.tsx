"use client";

import React from "react";
import clsx from "clsx";

interface Header4Props {
  children: React.ReactNode;
  className?: string; // class for h4
  wrapperClassName?: string; // optional outer div class
  button?: React.ReactNode; // optional right-side button
}

const Header4: React.FC<Header4Props> = ({
  children,
  className,
  wrapperClassName,
  button,
}) => {
  return (
    <div
      className={clsx("flex justify-between items-center", wrapperClassName)}
    >
      <h4 className={clsx("text-white text-2xl font-medium", className)}>
        {children}
      </h4>
      {button}
    </div>
  );
};

export default Header4;
