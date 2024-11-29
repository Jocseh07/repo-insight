"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/env";
import { generateCodeEmbeddings } from "../gemini/gemini";
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { question, sourceCodeEmbedding } from "@/server/db/schema";
import { db } from "@/server/db";
import { streamTextPrompt } from "@/data/prompts";

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

export async function askQuestion({
  question,
  projectId,
}: {
  question: string;
  projectId: string;
}) {
  const stream = createStreamableValue();
  const embedding = await generateCodeEmbeddings({ text: question });
  // const vectorQuery = `[${queryVector.join(",")}]`;
  const similarity = sql<number>`1 - (${cosineDistance(sourceCodeEmbedding.summaryEmbedding, embedding)})`;

  // const similar = await db.query.sourceCodeEmbedding.findMany({
  //   where: (table, { eq, gt, and }) =>
  //     and(gt(similarity, 0.5), eq(table.projectId, projectId)),
  //   limit: 4,
  //   orderBy: desc(similarity),
  //   columns: {
  //     id: true,
  //     sourceCode: true,
  //     summary: true,
  //   },
  // });

  const result = await db
    .select({
      sourceCode: sourceCodeEmbedding.sourceCode,
      filename: sourceCodeEmbedding.fileName,
      summary: sourceCodeEmbedding.summary,
      similarity,
    })
    .from(sourceCodeEmbedding)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  let context = "";

  for (const doc of result) {
    context += `Source: ${doc.filename} \nSource Code: ${doc.sourceCode}\nSummary: ${doc.summary}\nSimilarity: ${doc.similarity}\n\n`;
  }
  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: streamTextPrompt({
        context,
        question,
      }),
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();

  return {
    output: stream.value,
    fileReferences: result,
  };
}

export async function getQuestions({ projectId }: { projectId: string }) {
  // return await db
  //   .select()
  //   .from(question)
  //   .where(eq(question.projectId, projectId))
  //   .orderBy((t) => desc(t.createdAt));
  return await db.query.question.findMany({
    where: (table, { eq }) => eq(table.projectId, projectId),
    with: {
      user: true,
    },
    orderBy: desc(question.createdAt),
  });
}
