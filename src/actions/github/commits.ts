"use server";

import { octokit } from "./github";

export const getJustTheCommits = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) => {
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  return data;
};
