import { syncUser } from "@/actions/user/syncUser";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SyncUserPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-up");
  const data = {
    clerkId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    imageUrl: user.imageUrl,
  };

  await syncUser(data);
  redirect("/dashboard");
}
