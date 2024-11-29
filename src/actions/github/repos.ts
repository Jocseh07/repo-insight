"use server";

import { octokitNew } from "./github";

const octokit = await octokitNew();

export const getRepos = async ({
  username,
  sort,
  page,
  per_page,
  direction,
}: {
  username: string;
  sort?: "created" | "updated" | "pushed" | "full_name";
  page?: number;
  per_page?: number;
  direction?: "asc" | "desc";
}) => {
  const { data } = await octokit.rest.repos.listForUser({
    username,
    page: page || 1,
    per_page: per_page || 10,
    sort: sort || "created",
    direction: direction || "desc",
  });

  return data;
};

export async function getOneRepo({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const { data } = await octokit.rest.repos.get({
    owner,
    repo,
  });

  return data;
}

export async function getRepoReadme({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const { data } = await octokit.rest.repos.getReadme({
    owner,
    repo,
  });

  return data;
}

export async function getUserRepos() {
  const { data } = await octokit.rest.repos.listForAuthenticatedUser();
  return data;
}
