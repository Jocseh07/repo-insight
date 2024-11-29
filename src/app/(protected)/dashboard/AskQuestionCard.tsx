"use client";
import { askQuestion } from "@/actions/questions/questions";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/server/db/schema";
import { readStreamableValue } from "ai/rsc";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileReferences } from "@/types/types";
import CodeReferences from "./CodeReferences";
import { saveAnswer } from "@/actions/answers/answers";

const AskQuestionCard = ({ project }: { project: Project }) => {
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileReferences, setFileReferences] = useState<FileReferences>([]);
  const [answer, setAnswer] = useState("");

  const handleAskQuestion = async () => {
    if (!project.id) return;
    setAnswer("");
    setFileReferences([]);
    setLoading(true);
    toast.loading("Asking RepoInsight...", { id: "askQuestion" });
    const { output, fileReferences } = await askQuestion({
      question,
      projectId: project.id,
    });
    setFileReferences(fileReferences);
    toast.success("Question asked successfully", { id: "askQuestion" });
    setOpen(true);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((prev) => prev + delta);
      }
    }
    setLoading(false);
  };

  const handleSaveAnswer = async () => {
    if (!question || !answer) return;
    setLoading(true);
    toast.promise(
      async () =>
        await saveAnswer({
          questionAsked: question,
          answer,
          projectId: project.id,
          fileReferences: fileReferences,
        }),
      {
        loading: "Saving your answer...",
        success: "Answer saved successfully",
        error: "Error saving your answer",
      },
    );
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex !h-full max-h-[80vh] w-full max-w-[70vw] flex-col gap-2">
          <DialogHeader>
            <DialogTitle>
              <div className="flex h-10 w-full items-center gap-2">
                <Logo className="text-4xl" />
                <Button
                  variant={"outline"}
                  className="ml-auto w-fit"
                  disabled={loading}
                  type="button"
                  onClick={handleSaveAnswer}
                >
                  Save Answer
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <MDEditor.Markdown
            source={answer}
            className="h-full w-full overflow-y-scroll bg-background text-foreground"
          />
          <div className="h-4"></div>
          <CodeReferences fileReferences={fileReferences} />
          <Button disabled={loading} onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
      <Card className="relative w-full">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ask a question..."
            value={question}
            className="resize-none"
            rows={4}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="h-4"></div>
          <Button onClick={handleAskQuestion} disabled={!question || loading}>
            <Loader2
              className={cn({ "inline-flex animate-spin": loading }, "hidden")}
            />
            Ask RepoInsight
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
export default AskQuestionCard;
