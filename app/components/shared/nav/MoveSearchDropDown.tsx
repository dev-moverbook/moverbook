"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useSearchContext } from "@/app/contexts/SearchContext";
import MoveCustomerCard from "../../customer/CustomerCard";
import MoveOnlyCard from "../../move/MoveOnlyCard";
import { useSearchMoveCustomersAndJobId } from "@/app/hooks/queries/useSearchMoveCustomersAndJobId";

const MoveSearchDropdown = () => {
  const { query, visible, setVisible, setQuery } = useSearchContext();
  const { companyId, slug } = useSlugContext();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const trimmed = query.trim();
  const result = useSearchMoveCustomersAndJobId(companyId, trimmed);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setVisible]);

  const handleSelectCustomer = (id: string) => {
    router.push(`/app/${slug}/customer/${id}`);
    setQuery("");
    setVisible(false);
  };

  const handleSelectMove = (id: string) => {
    router.push(`/app/${slug}/moves/${id}`);
    setQuery("");
    setVisible(false);
  };

  if (!visible || trimmed === "") {
    return null;
  }

  let content: React.ReactNode;

  switch (result) {
    case undefined:
      content = <p className="p-4 text-grayCustom2 text-sm">Loading...</p>;
      break;

    default: {
      const { moveCustomers, moves } = result;
      const hasAny =
        (moveCustomers?.length ?? 0) > 0 || (moves?.length ?? 0) > 0;

      content = hasAny ? (
        <ul className="max-h-80 overflow-auto">
          {moveCustomers.length > 0 &&
            moveCustomers.map((customer) => (
              <MoveCustomerCard
                key={customer._id}
                moveCustomer={customer}
                onClick={() => handleSelectCustomer(customer._id)}
              />
            ))}

          {moves.length > 0 &&
            moves.map((move) => (
              <MoveOnlyCard
                key={move._id}
                move={move}
                showOnlyJobIdTag
                onNavigate={() => handleSelectMove(move._id)}
              />
            ))}
        </ul>
      ) : (
        <div className="p-4 text-grayCustom2 text-sm">No matches found.</div>
      );
      break;
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={`
        z-50 bg-black border rounded border-grayCustom shadow-xl shadow-white/10
        max-h-80 overflow-auto text-sm
        lg:ml-28
        fixed top-14 left-0 w-full
        sm:absolute sm:top-[52px] sm:left-1/2 sm:-translate-x-1/2 sm:w-[640px]
      `}
    >
      {content}
    </div>
  );
};

export default MoveSearchDropdown;
