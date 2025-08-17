// components/shared/ListRowLink.tsx
"use client";

import Link from "next/link";
import React from "react";
import clsx from "clsx";

interface ListRowLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  prefetch?: boolean;
}

const ListRowLink: React.FC<ListRowLinkProps> = ({
  href,
  className,
  children,
  prefetch = true,
  ...rest
}) => {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={clsx(
        "items-center justify-between p-4 border-b border-grayCustom hover:bg-background2  transition-colors duration-20 flex w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:rounded-lg",
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default ListRowLink;
