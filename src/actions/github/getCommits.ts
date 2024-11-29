"use server";

import {
  GetResponseTypeFromEndpointMethod,
  GetResponseDataTypeFromEndpointMethod,
} from "@octokit/types";
import { commit, Project } from "@/server/db/schema";
import { getProcessedCommits } from "../project/project";
import { summarizeCommits } from "../gemini/gemini";
import axios from "axios";
import { db } from "@/server/db";
import { octokitNew } from "./github";
const octokit = await octokitNew();

const repoUrl = "https://github.com/Valritehachi/PlatePlan";

export type GetCommitsType = GetResponseTypeFromEndpointMethod<
  typeof octokit.rest.repos.listCommits
>;
export type GetOneCommitType = GetResponseTypeFromEndpointMethod<
  typeof octokit.rest.repos.getCommit
>;

type GetCommitsExpectedResponseType = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorEmail: string;
  commitAuthorAvatarUrl: string;
  commitAuthorDate: string;
};

export const getCommits = async ({
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

  // const sortedCommits = data.sort(
  //   (a: GetCommitsType["data"][number], b: GetCommitsType["data"][number]) =>
  //     new Date(b.commit.author?.date || "").getTime() -
  //     new Date(a.commit.author?.date || "").getTime(),
  // );
  const sortedCommits = data;
  return sortedCommits.slice(0, 10).map((commit) => ({
    commitHash: commit.sha,
    commitMessage: commit.commit.message,
    commitAuthorName: commit.commit.author?.name || "",
    commitAuthorEmail: commit.commit.author?.email || "",
    commitAuthorAvatarUrl: commit.author?.avatar_url || "",
    commitAuthorDate: commit.commit.author?.date || "",
  }));
};

const filterUnprocessedCommits = async ({
  commits,
  projectId,
}: {
  commits: GetCommitsExpectedResponseType[];
  projectId: string;
}) => {
  const processedCommits = await getProcessedCommits({ projectId });
  const unprocessedCommits = commits.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );
  return unprocessedCommits;
};

export const pollCommits = async ({ project }: { project: Project }) => {
  const repoUrl = project.repoUrl;
  const [owner, repo] = repoUrl.split("/").slice(-2);
  if (!owner || !repo) return [];
  const commits = await getCommits({ owner, repo });
  const unprocessedCommits = await filterUnprocessedCommits({
    commits,
    projectId: project.id,
  });
  if (!unprocessedCommits.length) return [];

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return getCommitSummary({ repoUrl, commitHash: commit.commitHash });
    }),
  );
  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value;
    }
    return "";
  });

  const newCommits = await db.insert(commit).values(
    summaries.map((summary, index) => {
      return {
        projectId: project.id,
        commitMessage: unprocessedCommits[index]?.commitMessage || "",
        commitHash: unprocessedCommits[index]?.commitHash || "",
        commitAuthorName: unprocessedCommits[index]?.commitAuthorName || "",
        commitAuthorEmail: unprocessedCommits[index]?.commitAuthorEmail || "",
        commitAuthorAvatarUrl:
          unprocessedCommits[index]?.commitAuthorAvatarUrl || "",
        commitAuthorDate: unprocessedCommits[index]?.commitAuthorDate || "",
        aiSummary: summaries[index],
      };
    }),
  );

  // getCommitSummary({ repoUrl, commitHash: commits[0]?.commitHash || "" });
  return newCommits;
};

async function getCommitSummary({
  repoUrl,
  commitHash,
}: {
  repoUrl: string;
  commitHash: string;
}) {
  const diffUrl = repoUrl + "/commit/" + commitHash + ".diff";
  const { data } = await axios.get(diffUrl, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  // return await summarizeCommits({ diff: data });

  const summary = await summarizeCommits({ diff: data });
  return summary;
}
