"use client";
import { getUserProjects } from "@/actions/project/project";
import { Project } from "@/server/db/schema";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export const useSelectedProject = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "repoInsightProjectId",
    "",
  );

  useEffect(() => {
    const getProject = async () => {
      if (!user) return;
      const userProjects = await getUserProjects({ userId: user.id });
      setProjects(userProjects);
    };
    getProject();
  }, [user]);

  const project = projects?.find((project) => project.id === selectedProjectId);

  return {
    project,
    selectedProjectId,
    setSelectedProjectId,
  };
};
