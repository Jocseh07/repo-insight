import TopBar from "./TopBar";
import MainSection from "./MainSection";
import CommitSection from "./CommitSection";
import { getSelectedProject } from "@/actions/project/selectedProject";
import { getUserId } from "@/actions/helpers";

const Dashboard = async () => {
  const userId = await getUserId();
  const project = await getSelectedProject({ userId });

  return (
    <div>
      {project && (
        <>
          <TopBar project={project} />
          <MainSection project={project} />
          <CommitSection project={project} />
        </>
      )}
    </div>
  );
};
export default Dashboard;
