import { Metadata } from "next";
import PolicyView from "@/components/PolicyView";
import { DEFAULT_POLICIES, POLICY_KEYS } from "@/lib/siteContent";
import { loadJsonSetting } from "@/lib/siteContentServer";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

export default async function Page() {
  const page = await loadJsonSetting(POLICY_KEYS.privacy, DEFAULT_POLICIES.privacy);
  return <PolicyView page={page} />;
}
