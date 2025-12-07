"use client";

import Link from "next/link";
import { MessageSquare, Eye, CopyPlus } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface MoveCardActionsProps {
  messagesHref?: string;
  customerHref?: string;
  onDuplicate?: (move: Doc<"moves">) => void;
  move: Doc<"moves">;
}

export const MoveCardActions = ({
  messagesHref,
  customerHref,
  onDuplicate,
  move,
}: MoveCardActionsProps) => {
  return (
    <div className="flex gap-4  justify-start">
      {messagesHref && (
        <Link
          href={messagesHref}
          className="flex items-center gap-1 hover:opacity-80"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-base underline">Messages</span>
        </Link>
      )}

      {customerHref && (
        <Link
          href={customerHref}
          className="flex items-center gap-1 hover:opacity-80"
        >
          <Eye className="w-4 h-4" />
          <span className="text-base underline">View Customer</span>
        </Link>
      )}

      <button
        onClick={() => onDuplicate?.(move)}
        className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 hover:opacity-80"
      >
        <CopyPlus className="w-4 h-4" />
        <span className="text-base underline">Duplicate Move</span>
      </button>
    </div>
  );
};
