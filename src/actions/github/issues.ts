"use server";

import { octokit } from "./github";

export const getIssues = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) => {
  const { data } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
  });

  return data;
};
