"use server";

import { db } from "@/server/db";
import { user, type NewUser } from "@/server/db/schema";

export async function syncUser(data: NewUser) {
  try {
    await db.insert(user).values(data);
  } catch (error) {}
}
