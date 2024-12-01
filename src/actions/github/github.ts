import { env } from "@/env";
import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

// export async function newOctokit() {
//   return new Octokit({
//     // auth: token,
//   });
// }
