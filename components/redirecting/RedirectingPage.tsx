"use client";

import { useEffect, useRef } from "react";
import { useOrganizationList, useOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import FullLoading from "@/components/shared/skeleton/FullLoading";

type Props = {
  desiredOrgId: string;
  slug: string;
};

export default function ActivateOrgClient({ desiredOrgId, slug }: Props) {
  const { setActive } = useOrganizationList();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const didRun = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (didRun.current) {
      return;
    }
    if (!orgLoaded || !setActive || !userLoaded) {
      return;
    }
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    didRun.current = true;

    (async () => {
      if (!organization || organization.id !== desiredOrgId) {
        await setActive({ organization: desiredOrgId });
        router.refresh();
      }

      NProgress.start();
      router.replace(`/app/${slug}`);
    })();
  }, [
    desiredOrgId,
    orgLoaded,
    organization?.id,
    router,
    setActive,
    slug,
    user,
    userLoaded,
    organization,
  ]);

  return <FullLoading />;
}
