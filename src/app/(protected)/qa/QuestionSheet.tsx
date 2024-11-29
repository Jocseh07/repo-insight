"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AskQuestionCard from "../dashboard/AskQuestionCard";
import { Fragment, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/CodeReferences";
import { FileReferences } from "@/types/types";
import type { Project, Question, User } from "@/server/db/schema";

const QuestionSheet = ({
  questions,
  selectedProject,
  user,
}: {
  questions: Question[];
  selectedProject: Project;
  user: User | undefined;
}) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const question = questions[questionIdx];

  return (
    <Sheet>
      <AskQuestionCard project={selectedProject} />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2"></div>
      <div className="flex flex-col gap-2">
        {questions.map((question) => (
          <Fragment key={question.id}>
            <SheetTrigger onClick={() => setQuestionIdx(questionIdx)}>
              <div className="flex items-center gap-4 rounded border shadow">
                <Avatar>
                  <AvatarImage
                    src={user?.imageUrl || ""}
                    alt={user?.firstName || ""}
                    className="size-8 rounded-full"
                  />
                  <AvatarFallback>{user?.firstName[0] || ""}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-1 text-lg font-medium">
                      {question.question}
                    </p>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {question.createdAt?.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm">{question.answer}</p>
                </div>
              </div>
              {question.question}
            </SheetTrigger>
          </Fragment>
        ))}
      </div>
      {question && (
        <SheetContent className="sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle>{question.question}</SheetTitle>
            <MDEditor.Markdown source={question.answer} />
            <CodeReferences
              fileReferences={(question.fileReferences as FileReferences) ?? []}
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};
export default QuestionSheet;
