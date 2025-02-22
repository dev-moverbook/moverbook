"use client";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const RedirectAfterSigninPage = () => {
  const { user, organization, loaded } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!loaded) {
      if (!organization) {
        router.replace("/app/onboarding");
      } else {
        router.replace("/app");
      }
    }
  }, [loaded, user, organization, router]);

  return <div>Loading...</div>;
};
export default RedirectAfterSigninPage;
