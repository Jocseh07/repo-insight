import { getProjectCommits } from "@/actions/commits/commits";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Project } from "@/server/db/schema";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const CommitSection = async ({ project }: { project: Project }) => {
  const commits = await getProjectCommits({ projectId: project.id });

  return (
    <div className="mt-8">
      <ul className="space-y-6">
        {commits?.map((commit, commitIdx) => (
          <div className="flex w-full gap-x-4" key={commit.id}>
            <li className="relative flex gap-x-4" key={commit.id}>
              <div
                className={cn(
                  commitIdx === commits.length - 1 ? "h-6" : "-bottom-6",
                  "absolute left-0 top-0 flex w-6 justify-center",
                )}
              >
                <div className="w-px translate-x-1 bg-gray-200"></div>
              </div>
              <>
                <Avatar>
                  <AvatarImage
                    src={commit.commitAuthorAvatarUrl}
                    alt={commit.commitAuthorName}
                    className="size-8 rounded-full"
                  />
                  <AvatarFallback>{commit.commitAuthorName[0]}</AvatarFallback>
                </Avatar>
              </>
            </li>
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>{commit.commitAuthorName}</CardTitle>
                  <CardDescription>
                    <Link
                      href={`${project.repoUrl}/commit/${commit.commitHash}`}
                      className="inline-flex items-center hover:underline"
                    >
                      commit <ExternalLink className="ml-1 size-4" />
                    </Link>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <span className="font-semibold">{commit.commitMessage}</span>
                <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {commit.aiSummary}
                </pre>
              </CardContent>
            </Card>
          </div>
        ))}
      </ul>
    </div>
  );
};
export default CommitSection;
