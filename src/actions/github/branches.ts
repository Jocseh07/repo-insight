"use server";

import { octokit } from "./github";

export const getBranches = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) => {
  const { data } = await octokit.rest.repos.listBranches({
    owner,
    repo,
  });

  return data;
};
