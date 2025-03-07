import { useSlugContext } from "@/app/contexts/SlugContext";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { useQuery } from "convex/react";
import React from "react";
import UserCard from "./UserCard";

const InactiveUsers = () => {
  const { state } = useSlugContext();
  const slug = state.slug;

  // Run the query using the slug from the context.
  const usersResponse = useQuery(
    api.users.getAllUsersBySlug,
    slug ? { slug, isActive: false } : "skip"
  );

  if (!usersResponse) {
    return <div>Loading...</div>;
  }

  if (usersResponse.status === ResponseStatus.ERROR) {
    return <div>Error: {usersResponse.error}</div>;
  }
  console.log("inactive users", usersResponse.data.users);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inactive Users</h1>
      <div className="grid grid-cols-1 gap-4">
        {usersResponse.data.users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default InactiveUsers;
