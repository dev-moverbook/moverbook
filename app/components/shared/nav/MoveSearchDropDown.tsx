"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useMovesByName } from "@/app/hooks/queries/ useMovesByName";
import MoveCard from "../../move/MoveCard";
import { useSearchContext } from "@/app/contexts/SearchContext";

const MoveSearchDropdown = () => {
  const { query, visible, setVisible, setQuery } = useSearchContext();
  const { companyId, slug } = useSlugContext();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: moves, isLoading } = useMovesByName(companyId, query);

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

  const handleSelect = (id: string) => {
    router.push(`/app/${slug}/moves/${id}`);
    setQuery("");
    setVisible(false);
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
      ) : moves?.length ? (
        <ul className="max-h-80 overflow-auto">
          {moves.map((move) => (
            <li key={move._id} onClick={() => handleSelect(move._id)}>
              <MoveCard move={move} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-gray-400 text-sm">No matches found.</div>
      )}
    </div>
  );
};

export default MoveSearchDropdown;
