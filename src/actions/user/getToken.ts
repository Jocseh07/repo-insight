"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { getUserId } from "../helpers";

export const getToken = async () => {
  const userId = await getUserId();
  const client = await clerkClient();
  const response = await client.users.getUserOauthAccessToken(
    userId,
    "oauth_github",
  );
  if (response.data.length === 0) return undefined;
  const data = response.data[0];
  return data?.token;
};
