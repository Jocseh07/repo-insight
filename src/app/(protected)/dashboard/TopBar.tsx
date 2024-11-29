"use client";
import { archiveProject, deleteProject } from "@/actions/project/project";
import { Button } from "@/components/ui/button";
import { Project } from "@/server/db/schema";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const TopBar = ({ project }: { project: Project }) => {
  const handleDelete = async () => {
    toast.promise(async () => await deleteProject({ projectId: project.id }), {
      loading: "Deleting your project...",
      success: "Project deleted successfully",
      error: "Error deleting project",
    });
  };
  const handleArchive = async () => {
    const confirm = window.confirm(
      "Are you sure you want to archive this project? This will remove it from your list of projects.",
    );
    if (!confirm) return;
    toast.promise(async () => await archiveProject({ projectId: project.id }), {
      loading: "Archiving your project...",
      success: "Project archived successfully",
      error: "Error archiving project",
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-4">
      <div className="flex w-fit items-center rounded bg-primary px-4 py-3">
        <Github className="size-5" />
        <div className="ml-2 text-white">
          <p className="text-sm font-medium text-white">
            This project is linked to{" "}
            <Link
              href={project.repoUrl}
              className="inline-flex items-center text-white/80 hover:underline"
            >
              {project.repoUrl}
              <ExternalLink className="ml-1 size-4" />
            </Link>
          </p>
        </div>
      </div>

      <div className="h-4"></div>

      <div className="flex items-center gap-4">
        {/* <Button variant={"destructive"} onClick={handleDelete}>
          Delete
        </Button> */}
        <Button variant={"destructive"} onClick={handleArchive}>
          Archive
        </Button>
      </div>
    </div>
  );
};
export default TopBar;
