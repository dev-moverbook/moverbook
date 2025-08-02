"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useSearchContext } from "@/app/contexts/SearchContext";
import { useSearchMoveCustomersAndJobId } from "@/app/hooks/queries/useSearchMoveCustomersAndJobId";
import MoveCustomerCard from "../../customer/CustomerCard";
import MoveOnlyCard from "../../move/MoveOnlyCard";
import { Id } from "@/convex/_generated/dataModel";

const MoveSearchDropdown = () => {
  const { query, visible, setVisible, setQuery } = useSearchContext();
  const { companyId, slug } = useSlugContext();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading } = useSearchMoveCustomersAndJobId(companyId, query);

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

  const handleSelectMove = (moveId: Id<"move">) => {
    setQuery("");
    setVisible(false);
    router.push(`/app/${slug}/moves/${moveId}`);
  };

  if (!visible || query.trim() === "") return null;

  return (
    <div
      ref={dropdownRef}
      className={`
        z-50
        bg-black border rounded border-grayCustom shadow-xl shadow-white/10
        max-h-80 overflow-auto
        text-sm
        lg:ml-28
        fixed top-14 left-0 w-full  
        sm:absolute sm:top-[52px] sm:left-1/2 sm:-translate-x-1/2 sm:w-[640px] 
      `}
    >
      {isLoading ? (
        <p className="p-4 text-gray-400 text-sm">Loading...</p>
      ) : data?.moveCustomers.length || data?.moves.length ? (
        <ul className="max-h-80 overflow-auto">
          {data.moveCustomers.length > 0 && (
            <>
              {data.moveCustomers.map((customer) => (
                <MoveCustomerCard
                  key={customer._id}
                  moveCustomer={customer}
                  onClick={() => handleSelectCustomer(customer._id)}
                />
              ))}
            </>
          )}

          {data.moves.length > 0 && (
            <>
              {data.moves.map((move) => (
                <MoveOnlyCard
                  key={move._id}
                  move={move}
                  onClick={() => handleSelectMove(move._id)}
                />
              ))}
            </>
          )}
        </ul>
      ) : (
        <div className="p-4 text-gray-400 text-sm">No matches found.</div>
      )}
    </div>
  );
};

export default MoveSearchDropdown;
