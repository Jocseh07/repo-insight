"use client";

import { Github } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createProject } from "@/actions/project/project";
import { newProjectSchema, NewProjectSchemaType } from "@/types/types";
import { project } from "@/server/db/schema";
import { pollCommits } from "@/actions/github/getCommits";
import { indexGithubRepo } from "@/actions/github/githubLoader";

const CreatePage = () => {
  const form = useForm<NewProjectSchemaType>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      projectName: "",
      repoUrl: "",
      githubToken: "",
    },
  });

  const onSubmit = async (data: NewProjectSchemaType) => {
    const newProject = toast.promise(async () => await createProject(data), {
      loading: "Creating your project...",
      success: "Project created successfully",
      error: "Error creating project",
    });
    const project_1 = await newProject.unwrap();
    const project_2 = project_1[0];
    if (!project_2) return;

    toast.promise(async () => await pollCommits({ project: project_2 }), {
      loading: "Polling your commits...",
      success: "Polling completed successfully",
      error: "Error polling project",
    });

    toast.promise(async () => await indexGithubRepo({ project: project_2 }), {
      loading: "Indexing your repository...",
      success: "Project indexed successfully",
      error: "Error indexing project",
    });
    form.reset();
  };

  return (
    <div className="flex h-full items-center justify-center gap-4">
      <div>
        <div className="flex items-center gap-4">
          <Github />
          <div>
            <h1 className="text-2xl font-semibold">
              Link your Github Repository
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the URL of your Github repository ato link to Repo Insight.
            </p>
          </div>
        </div>
        <div className="h-6"></div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Repository URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Github Token (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Github Token (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Link</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
