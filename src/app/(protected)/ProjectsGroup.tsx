"use client";
import { setSelectedProject } from "@/actions/project/selectedProject";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Project } from "@/server/db/schema";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const ProjectsGroup = ({
  projects,
  selectedProjectId,
}: {
  projects: Project[];
  selectedProjectId: string | undefined;
}) => {
  const handleChangeProject = async (projectId: string) => {
    toast.promise(async () => await setSelectedProject(projectId), {
      loading: "Changing project...",
      success: "Project changed successfully",
      error: "Error changing project",
    });
  };

  const { open } = useSidebar();
  return (
    <div>
      <SidebarGroup>
        <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.projectName}>
                <SidebarMenuButton
                  asChild
                  variant={"outline"}
                  // className={cn({
                  //   "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground":
                  // })}
                  className="cursor-pointer"
                  onClick={() => handleChangeProject(project.id)}
                >
                  <div>
                    <div
                      className={cn(
                        "flex size-6 items-center justify-center rounded border text-sm",
                        {
                          "bg-primary text-primary-foreground":
                            selectedProjectId === project.id,
                        },
                      )}
                    >
                      {project.projectName[0]}
                    </div>
                    <span>{project.projectName}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <div className="h-2"></div>
            {open && (
              <SidebarMenuItem>
                <Button variant={"outline"} className="w-full" asChild>
                  <Link href={"/create"}>
                    <Plus />
                    Create Project
                  </Link>
                </Button>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};
export default ProjectsGroup;
