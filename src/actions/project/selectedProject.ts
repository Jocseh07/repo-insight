"use server";

import { db } from "@/server/db";
import { getUserId } from "../helpers";
import { selectedProject, user } from "@/server/db/schema";
import {
  unstable_cacheLife,
  unstable_cacheTag,
  unstable_expireTag,
} from "next/cache";

export async function getSelectedProjectId({ userId }: { userId: string }) {
  const selectedProject = await getSelectedProject({ userId });
  return selectedProject?.id;
}

export async function getSelectedProject({ userId }: { userId: string }) {
  "use cache";
  unstable_cacheLife("max");
  unstable_cacheTag("selectedProject", userId);
  const currentSelectedProject = await db.query.selectedProject.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
    with: {
      project: true,
    },
  });
  return currentSelectedProject?.project;
}

export async function setSelectedProject(projectId: string) {
  const userId = await getUserId();
  unstable_expireTag("selectedProject", userId);
  await db
    .insert(selectedProject)
    .values({
      projectId,
      userId,
    })
    .onConflictDoUpdate({ target: selectedProject.userId, set: { projectId } });
}
