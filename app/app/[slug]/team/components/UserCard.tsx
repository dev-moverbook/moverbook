"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { UserSchema } from "@/types/convex-schemas";
import { ClerkRoleLabels } from "@/types/enums";
import Image from "next/image";

interface UserCardProps {
  user: UserSchema;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push(`${pathname}/${user._id}`);
  };
  if (user.role) console.log(ClerkRoleLabels[user.role]);

  return (
    <div
      className="border-b border-grayCustom hover:bg-gray-800 p-4 cursor-pointer flex items-center justify-between"
      onClick={handleClick}
    >
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
              {ClerkRoleLabels[user.role]}
            </p>
          )}
        </div>
      </div>

      <ChevronRight className="text-grayCustom2" size={20} />
    </div>
  );
};

export default UserCard;
