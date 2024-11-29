import { examplePrompt, summarizeCodePrompt } from "@/data/prompts";
import { env } from "@/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const genAi = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const summarizeCommits = async ({ diff }: { diff: string }) => {
  const response = await model.generateContent([
    ...examplePrompt,
    `Please summarize the following diff file \n\n ${diff}`,
  ]);
  return response.response.text();
};

export const summarizeCode = async ({ doc }: { doc: Document }) => {
  const code = doc.pageContent.slice(0, 10000);
  try {
    const response = await model.generateContent([
      summarizeCodePrompt({ code, filename: doc.metadata.source }),
    ]);
    return response.response.text();
  } catch {
    return "";
  }
};

export const generateCodeEmbeddings = async ({ text }: { text: string }) => {
  const model = genAi.getGenerativeModel({
    model: "text-embedding-004",
  });
  const response = await model.embedContent(text);
  const embedding = response.embedding;
  return embedding.values;
};
