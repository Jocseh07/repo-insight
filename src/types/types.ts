import { z } from "zod";

export const newProjectSchema = z.object({
  projectName: z.string().min(3, "Project name is required"),
  repoUrl: z.string().url("Repository url is required"),
  githubToken: z.string().optional(),
});

export type NewProjectSchemaType = z.infer<typeof newProjectSchema>;

export type OneDocumentType = {
  pageContent: string;
  metadata: {
    source: string;
    repository: string;
    branch: string;
  };
  id: string | undefined;
};

export type DocumentsType = DocumentType[];

export type FileReferences = {
  sourceCode: string;
  filename: string;
  summary: string;
  similarity: number;
}[];
