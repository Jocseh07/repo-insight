import Logo from "@/components/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import ProjectsGroup from "./ProjectsGroup";
import NavGroup from "./NavGroup";
import { getUserProjects } from "@/actions/project/project";
import { getUserId } from "@/actions/helpers";
import { getSelectedProjectId } from "@/actions/project/selectedProject";

const AppSidebar = async () => {
  const userId = await getUserId();
  const projects = await getUserProjects({ userId });
  const selectedProjectId = await getSelectedProjectId({ userId });
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <NavGroup />

        <ProjectsGroup
          projects={projects}
          selectedProjectId={selectedProjectId}
        />
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
