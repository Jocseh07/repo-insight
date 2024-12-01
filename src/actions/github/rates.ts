"use server";
import { connection } from "next/server";
import { octokit } from "./github";

export const getRateLimit = async () => {
  await connection();
  const { data } = await octokit.rest.rateLimit.get();
  return data;
};
