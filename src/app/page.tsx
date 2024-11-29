import { getUserRepos } from "@/actions/github/repos";

export default async function HomePage() {
  const repos = await getUserRepos();
  console.log(repos);
  return <div>Home</div>;
}
