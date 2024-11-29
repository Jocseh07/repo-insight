"use server";

import { db } from "@/server/db";
import { commit } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { pollCommits } from "../github/getCommits";
import { getOneProject } from "../project/project";

export async function getProjectCommits({ projectId }: { projectId: string }) {
  const project = await getOneProject({ projectId });
  if (!project) return [];
  await pollCommits({ project });
  return await db.select().from(commit).where(eq(commit.projectId, projectId));
}
