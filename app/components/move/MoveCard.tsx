import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MoveCardProps {
  date: string;
  name: string;
  avatarUrl?: string;
  status: string;
  price: string;
  tags: string[];
}

const MoveCard: React.FC<MoveCardProps> = ({
  date,
  name,
  avatarUrl,
  status,
  price,
  tags,
}) => {
  return (
    <div className="bg-black rounded-lg p-4 text-white shadow-md">
      <p className="text-xs text-gray-400 mb-1">{date}</p>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">● {status}</span>
            <span className="text-green-500 font-medium">{price}</span>
          </div>
        </div>
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex gap-2 flex-wrap mt-3">
        {tags.map((tag, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="bg-gray-700 text-white rounded-full px-3 py-1 text-xs"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MoveCard;
