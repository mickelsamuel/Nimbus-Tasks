import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function HomePage() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  redirect("/dashboard");
}