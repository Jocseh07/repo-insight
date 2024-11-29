import { getUserId } from "@/actions/helpers";
import { getSelectedProject } from "@/actions/project/selectedProject";
import { getQuestions } from "@/actions/questions/questions";
import QuestionSheet from "./QuestionSheet";

const QAPage = async () => {
  const userId = await getUserId();
  const selectedProject = await getSelectedProject({ userId });
  if (!selectedProject) return;
  const questions = await getQuestions({ projectId: selectedProject.id });

  return (
    <QuestionSheet
      questions={questions}
      selectedProject={selectedProject}
      user={questions[0]?.user}
    />
  );
};
export default QAPage;
