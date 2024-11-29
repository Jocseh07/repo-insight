"use server";

import { octokit } from "./github";

export const getReleases = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) => {
  const { data } = await octokit.rest.repos.listReleases({
    owner,
    repo,
  });
  return data;
};
