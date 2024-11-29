"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export const getUserId = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");
  return userId;
};
