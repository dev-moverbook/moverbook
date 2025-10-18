"use client";

import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return <div>Please sign in to continue.</div>;
  }

  return <div>Hello, {user.firstName}!</div>;
};

export default Page;
