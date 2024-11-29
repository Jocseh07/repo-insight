import { Project } from "@/server/db/schema";
import AskQuestionCard from "./AskQuestionCard";

const MainSection = ({ project }: { project: Project }) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 gap-4">
        <AskQuestionCard project={project} />
      </div>
    </div>
  );
};
export default MainSection;
