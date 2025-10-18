"use client";

import { useEffect, useRef } from "react";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import FullLoading from "@/components/shared/FullLoading";

type Props = {
  desiredOrgId: string;
  slug: string;
};

export default function ActivateOrgClient({ desiredOrgId, slug }: Props) {
  const { setActive } = useOrganizationList();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const didRun = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (didRun.current) {
      return;
    }
    if (!orgLoaded || !setActive) {
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
  }, [desiredOrgId, orgLoaded, organization, router, setActive, slug]);

  return <FullLoading />;
}
