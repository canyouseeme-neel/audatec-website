import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LegacyPlaygroundRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/demo");
  }, [router]);

  return null;
}
