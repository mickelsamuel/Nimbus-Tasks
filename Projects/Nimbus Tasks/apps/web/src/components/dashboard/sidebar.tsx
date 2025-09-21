"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nimbus/ui";
import {
  Home,
  CheckSquare,
  Folder,
  Users,
  Settings,
  Tag,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Projects", href: "/dashboard/projects", icon: Folder },
  { name: "Teams", href: "/dashboard/teams", icon: Users },
  { name: "Tags", href: "/dashboard/tags", icon: Tag },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center h-16 px-6 bg-gray-800">
        <h1 className="text-xl font-bold text-white">Nimbus Tasks</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}