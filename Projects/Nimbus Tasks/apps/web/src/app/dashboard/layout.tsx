import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { DashboardSidebar } from "~/components/dashboard/sidebar";
import { DashboardHeader } from "~/components/dashboard/header";
import { KeyboardShortcutsProvider } from "~/components/providers/keyboard-shortcuts-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <KeyboardShortcutsProvider>
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-white">
            {children}
          </main>
        </div>
      </div>
    </KeyboardShortcutsProvider>
  );
}