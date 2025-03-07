"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserSchema } from "@/types/convex-schemas"; // Adjust import as needed

interface UserCardProps {
  user: UserSchema;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push(`${pathname}/${user._id}`);
  };

  return (
    <div
      className="border rounded p-4 cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      <p className="text-lg font-semibold">{user.name}</p>
    </div>
  );
};

export default UserCard;
