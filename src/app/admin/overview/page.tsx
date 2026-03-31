"use client";

import { Users, LayoutGrid, CheckCircle2, ChevronRight, User, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const usersList = [
    { name: "Users", icon: User },
    { name: "Users", icon: User },
    { name: "Teachers", icon: Users },
  ];

  const classesList = [
    { name: "Student 1", color: "bg-emerald-500", letter: "A" },
    { name: "Classes 1", color: "bg-indigo-500", letter: "B" },
    { name: "Classes 2", color: "bg-pink-500", letter: "S" },
    { name: "Classes 3", color: "bg-blue-500", letter: "S" },
  ];

  const subjectsList = [
    { name: "Class 1", color: "bg-blue-500", letter: "A" },
    { name: "Class 2", color: "bg-cyan-500", letter: "B" },
    { name: "Valaat 3", color: "bg-emerald-500", letter: "B" },
    { name: "Subject", color: "bg-rose-500", letter: "S" },
  ];

  return (
    <div className="h-full w-full">
      <div className="glass-card rounded-2xl p-6 space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Students */}
          <div className="rounded-xl p-5 bg-white/40 border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Students
              </h3>
              <Users className="text-slate-400" size={18} />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              1,245
            </p>
          </div>

          {/* Classes */}
          <div className="rounded-xl p-5 bg-white/40 border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Classes
              </h3>
              <LayoutGrid className="text-slate-400" size={18} />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              48
            </p>
          </div>

          {/* Attendance */}
          <div className="rounded-xl p-5 bg-white/40 border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Attendance
              </h3>
              <CheckCircle2 className="text-emerald-500" size={18} />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              92%
            </p>
            <div className="mt-3 h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 rounded-full w-[92%]" />
            </div>
          </div>
        </div>

        {/* Lists Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Users List */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-800 px-1">
              Users
            </h4>
            <div className="space-y-1">
              {usersList.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-100/60 text-slate-500">
                      <item.icon size={14} />
                    </div>
                    <span className="font-medium text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Classes List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h4 className="font-bold text-sm text-slate-800">
                Classes
              </h4>
              <Link
                href="/admin/classes"
                className="text-[11px] font-bold text-blue-500 hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="space-y-1">
              {classesList.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group bg-white/20 border border-slate-100/50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.color} text-white font-bold text-xs shadow-sm`}
                    >
                      {item.letter}
                    </div>
                    <span className="font-medium text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Subjects List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h4 className="font-bold text-sm text-slate-800">
                Subjects
              </h4>
              <Link
                href="/admin/subjects"
                className="text-[11px] font-bold text-blue-500 hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="space-y-1">
              {subjectsList.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group bg-white/20 border border-slate-100/50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.color} text-white font-bold text-xs shadow-sm`}
                    >
                      {item.letter}
                    </div>
                    <span className="font-medium text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-0.5"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
