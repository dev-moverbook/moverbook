"use client";

import { useEffect, useRef } from "react";
import { useOrganizationList, useOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import FullLoading from "@/components/shared/skeleton/FullLoading";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ClerkRoles } from "@/types/enums";

export default function RedirectingSignupPage() {
  const { setActive } = useOrganizationList();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const didRun = useRef(false);
  const router = useRouter();

  const companyData = useQuery(api.companies.getSignUpInvitation);

  useEffect(() => {
    if (didRun.current) {
      return;
    }
    if (!orgLoaded || !setActive || !userLoaded || !companyData) {
      return;
    }
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    didRun.current = true;

    const moveId = companyData.moveId;
    const slug = companyData.slug;

    (async () => {
      if (moveId && slug) {
        router.replace(`/${slug}/moves/${moveId}`);
        return;
      }
      if (
        companyData.company === null &&
        companyData.user &&
        companyData.user.role === ClerkRoles.ADMIN &&
        !organization
      ) {
        router.replace("/app/onboarding");
        return;
      }
      if (organization) {
        router.replace(`/app/${companyData.company?.slug}`);
        return;
      }
      if (!organization) {
        await setActive({
          organization: companyData.company?.clerkOrganizationId,
        });
        router.refresh();
      }

      NProgress.start();
      router.replace(`/app/${companyData.company?.slug}`);
    })();
  }, [
    orgLoaded,
    organization?.id,
    router,
    setActive,
    user,
    userLoaded,
    companyData,
    organization,
  ]);

  return <FullLoading />;
}
