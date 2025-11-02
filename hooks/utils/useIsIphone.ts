import { useEffect, useState } from "react";

export function useIsIphone(): boolean {
  const [isIphone, setIsIphone] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIphone(/iphone/.test(userAgent));
    }
  }, []);

  return isIphone;
}
