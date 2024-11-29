"use server";

import { octokit } from "./github";

export const getRateLimit = async () => {
  const { data } = await octokit.rest.rateLimit.get();
  return data;
};
