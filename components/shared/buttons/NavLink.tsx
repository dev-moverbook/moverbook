"use client";

import Link from "next/link";
import NProgress from "nprogress";
import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import ConfirmModal from "../ConfirmModal";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onNavigate?: () => void;
  disabled?: boolean;
}

const NavLink = ({
  href,
  children,
  onNavigate,
  disabled = false,
}: NavLinkProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      if (pathname?.includes("add-move")) {
        e.preventDefault();
        setPendingHref(href);
        setShowModal(true);
        NProgress.done();
        return;
      }

      NProgress.start();
      onNavigate?.();
    },
    [disabled, onNavigate, pathname, href]
  );

  const handleConfirm = () => {
    setShowModal(false);
    if (pendingHref) {
      NProgress.start();
      router.push(pendingHref);
      setPendingHref(null);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPendingHref(null);
  };

  return (
    <>
      <Link href={disabled ? "#" : href} onClick={handleClick} passHref>
        <Button variant="sidebar" asChild disabled={disabled}>
          <span className="flex items-center gap-2">{children}</span>
        </Button>
      </Link>
      <ConfirmModal
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to leave this page?"
        isOpen={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        deleteLoading={false}
        deleteError={null}
      />
    </>
  );
};

export default NavLink;
