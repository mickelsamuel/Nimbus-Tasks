import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/components/auth/auth-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nimbus Tasks - Team Collaboration Platform",
  description: "Multi-tenant task management and collaboration platform",
  keywords: ["tasks", "collaboration", "project management", "team productivity"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}