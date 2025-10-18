"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import UserCardBorder from "@/components/shared/card/UserCardBorder";
import Link from "next/link";
import NProgress from "nprogress";
import { Doc } from "@/convex/_generated/dataModel";

interface UserCardProps {
  user: Doc<"users">;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const pathname = usePathname();

  const handleClick = () => {
    NProgress.start();
  };

  return (
    <Link href={`${pathname}/${user._id}`} onClick={handleClick}>
      <UserCardBorder>
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-4">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              {user.name[0]}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            {user.role && (
              <p className="text-sm text-grayCustom2 capitalize">
                {" "}
                {[user.role]}
              </p>
            )}
          </div>
        </div>

        <ChevronRight className="text-grayCustom2" size={20} />
      </UserCardBorder>
    </Link>
  );
};

export default UserCard;
