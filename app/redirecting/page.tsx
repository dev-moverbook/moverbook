"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useOrganizationList, useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ResponseStatus, UserRole } from "@/types/enums";
import NProgress from "nprogress";
import { api } from "@/convex/_generated/api";
import FullLoading from "@/app/components/shared/FullLoading";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";

const RedirectingPage = () => {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const { setActive } = useOrganizationList();
  const { organization, isLoaded: organizationLoaded } = useOrganization();
  const [error, setError] = useState<boolean>(false);
  const [hasSetActive, setHasSetActive] = useState<boolean>(false);
  const [pollCount, setPollCount] = useState<number>(0);

  const companyResponse = useQuery(
    api.companies.getCompanyClerkUserId,
    user && userLoaded ? { clerkUserId: user.id } : "skip"
  );

  useEffect(() => {
    const redirect = async () => {
      console.log("user", user);
      console.log("userLoaded", userLoaded);
      console.log("organizationLoaded", organizationLoaded);
      console.log("companyResponse", companyResponse);
      console.log("setActive", setActive);
      console.log("organization", organization);
      console.log("hasSetActive", hasSetActive);

      if (!userLoaded || !organizationLoaded) return;

      if (!user) {
        NProgress.start();
        router.push("/sign-in");
        return;
      }

      if (!companyResponse || !setActive) return;

      if (companyResponse.status === ResponseStatus.ERROR) {
        console.error(companyResponse.error);
        setError(true);
        return;
      }

      const companyData = companyResponse.data?.company;
      const orgRole = user?.publicMetadata.role as string;

      if (!companyData && pollCount < 6) {
        setTimeout(() => setPollCount((c) => c + 1), 500);
        return;
      }

      if (!companyData) {
        if (orgRole === UserRole.ADMIN) {
          NProgress.start();
          router.push("/app/onboarding");
        }
        return;
      }

      if (
        !companyData ||
        companyData.clerkOrganizationId !== organization?.id
      ) {
        if (!hasSetActive) {
          setHasSetActive(true);
          await setActive({ organization: companyData.clerkOrganizationId });
          setTimeout(() => {
            router.refresh(); // or window.location.reload();
          }, 500);
        }
        return;
      }

      NProgress.start();

      if (orgRole === UserRole.APP_MODERATOR) {
        router.push(`app/${companyData.slug}/companies`);
      } else {
        router.push(`app/${companyData.slug}`);
      }
    };

    redirect();
  }, [
    user,
    userLoaded,
    organizationLoaded,
    companyResponse,
    setActive,
    organization,
    router,
    hasSetActive,
    pollCount,
  ]);

  if (error) {
    return <ErrorMessage message="error" />;
  }

  return <FullLoading />;
};

export default RedirectingPage;
