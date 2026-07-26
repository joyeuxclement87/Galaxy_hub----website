import { getHomepageData } from "@/data/homepage";
import HomeClient from "@/app/(landing)/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomepageData();

  return <HomeClient data={data} />;
}
