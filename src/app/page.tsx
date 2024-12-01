import { getRateLimit } from "@/actions/github/rates";

export default async function HomePage() {
  const rateLimit = await getRateLimit();
  return <div>Home</div>;
}
