"use server";

import { db } from "@/server/db";
import { getUserId } from "../helpers";
import { NewNote, notes, user } from "@/server/db/schema";
import {
  unstable_cacheLife,
  unstable_cacheTag,
  unstable_expireTag,
} from "next/cache";
import { eq } from "drizzle-orm";

export async function getNotes({ repoId }: { repoId: string }) {
  const userId = await getUserId();
  return await db.query.notes.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.repoId, repoId), eq(table.userId, userId)),
    with: {
      user: true,
    },
    orderBy: notes.createdAt,
  });
}

export async function getAllNotes({ userId }: { userId: string }) {
  "use cache";
  unstable_cacheLife("max");
  unstable_cacheTag("allNotes", userId);
  return await db.query.notes.findMany({
    where: (table, { eq }) => eq(table.userId, userId),
    with: {
      user: true,
    },
    orderBy: notes.createdAt,
  });
}

export async function createNote({ note }: { note: NewNote }) {
  const userId = await getUserId();
  unstable_expireTag("allNotes", userId);
  await db.insert(notes).values({
    ...note,
    userId,
  });
}

export async function deleteNote({ noteId }: { noteId: string }) {
  const userId = await getUserId();
  unstable_expireTag("allNotes", userId);
  await db.delete(notes).where(eq(notes.id, noteId));
}

export async function updateNote({
  noteId,
  note,
}: {
  noteId: string;
  note: Partial<NewNote>;
}) {
  const userId = await getUserId();
  unstable_expireTag("allNotes", userId);
  await db.update(notes).set(note).where(eq(notes.id, noteId));
}
