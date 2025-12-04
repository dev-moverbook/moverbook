"use client";

import { Button } from "../ui/button";
import { CopyPlus, Eye, MessageSquare } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface MoveCardActionsProps {
  onMessagesClick?: () => void;
  onViewCustomerClick?: () => void;
  onDuplicate?: (move: Doc<"moves">) => void;
  move: Doc<"moves">;
}
export const MoveCardActions = ({
  onMessagesClick,
  onViewCustomerClick,
  onDuplicate,
  move,
}: MoveCardActionsProps) => (
  <div className="flex gap-4 mt-2 justify-start">
    <Button size="auto" variant="link" onClick={onMessagesClick}>
      <span className="flex items-center gap-1">
        <MessageSquare className="w-4 h-4" />
        <span className="text-base">Messages</span>
      </span>
    </Button>
    <Button size="auto" variant="link" onClick={onViewCustomerClick}>
      <span className="flex items-center gap-1">
        <Eye className="w-4 h-4" />
        <span className="text-base">View Customer</span>
      </span>
    </Button>
    <Button size="auto" variant="link" onClick={() => onDuplicate?.(move)}>
      <span className="flex items-center gap-1">
        <CopyPlus className="w-4 h-4" />
        <span className="text-base">Duplicate Move</span>
      </span>
    </Button>
  </div>
);
