"use server";
import { Project, sourceCodeEmbedding } from "@/server/db/schema";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateCodeEmbeddings, summarizeCode } from "../gemini/gemini";
import { db } from "@/server/db";

export const githubLoader = async ({ project }: { project: Project }) => {
  const loader = new GithubRepoLoader(project.repoUrl, {
    accessToken: project.githubToken || "",
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "bun.lockb",
      "pnpm-lock.yaml",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async ({ project }: { project: Project }) => {
  const docs = await githubLoader({ project });
  const allEmbeddings = await generateEmbeddings(docs);
  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      if (!embedding) return;
      await db
        .insert(sourceCodeEmbedding)
        .values({
          projectId: project.id,
          sourceCode: embedding.sourceCode,
          fileName: embedding.filename,
          summary: embedding.summary,
          summaryEmbedding: embedding.embedding,
        })
        .returning();
    }),
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = await summarizeCode({ doc });
      const embedding = await generateCodeEmbeddings({ text: summary });
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        filename: doc.metadata.source,
      };
    }),
  );
};
