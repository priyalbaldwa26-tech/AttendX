"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Trophy,
  Home,
  GraduationCap,
  BarChart3,
  UserCircle,
} from "lucide-react";

interface SidebarProps {
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

const menuItems = {
  ADMIN: [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Students", icon: GraduationCap, href: "/admin/students" },
    { name: "Teachers", icon: UserCircle, href: "/admin/teachers" },
    { name: "Classes", icon: BookOpen, href: "/admin/classes" },
  ],
  TEACHER: [
    { name: "Attendance", icon: ClipboardCheck, href: "/teacher" },
    { name: "Reports", icon: BarChart3, href: "/teacher/reports" },
  ],
  STUDENT: [
    { name: "Dashboard", icon: LayoutDashboard, href: "/student" },
    { name: "Students", icon: Users, href: "/student/students" },
    { name: "Classes", icon: BookOpen, href: "/student/classes" },
    { name: "Leaderboard", icon: Trophy, href: "/student/leaderboard" },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = menuItems[role];

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/teacher" || href === "/student") {
      const rootMap: Record<string, string[]> = {
        "/admin": ["/admin", "/admin/overview"],
        "/teacher": ["/teacher", "/teacher/attendance"],
        "/student": ["/student", "/student/dashboard"],
      };
      return rootMap[href]?.some((p) => pathname === p) ?? false;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="glass-sidebar flex flex-col items-center w-[72px] min-h-screen py-4 gap-2 z-50 shrink-0">
      {/* App Icon */}
      <Link
        href={role === "ADMIN" ? "/admin" : role === "TEACHER" ? "/teacher" : "/student"}
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white mb-4 shadow-lg hover:scale-105 transition-transform"
      >
        <Home size={20} />
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col items-center justify-center w-full py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-white/90 text-blue-600 shadow-sm"
                  : "text-slate-500 hover:bg-white/50 hover:text-slate-800"
              }`}
            >
              <item.icon
                size={20}
                className={`mb-0.5 transition-colors ${
                  active
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              <span
                className={`text-[9px] font-semibold leading-tight ${
                  active ? "text-blue-600" : ""
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
