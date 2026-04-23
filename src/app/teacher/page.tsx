"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, Trophy, Users, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/teacher/assignments");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Derive unique classes from assignments
          const uniqueClasses = Array.from(
            new Map(data.map((item: any) => [item.class.id, item.class])).values()
          );
          setClasses(uniqueClasses);
        } else {
          setClasses([]);
        }
      } catch {
        toast.error("Failed to load assigned classes");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="h-full w-full space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[#1e3a5f] text-white flex items-center justify-center shrink-0">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Assigned Classes</h1>
          <p className="text-sm text-slate-500">Select a class to manage attendance or view the leaderboard.</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm font-medium">Loading your classes...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && classes.length === 0 && (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <AlertCircle size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Classes Assigned</h3>
          <p className="text-sm text-slate-400 text-center max-w-xs">
            You have no assigned classes yet. Please contact your admin to get assigned.
          </p>
        </div>
      )}

      {/* Class Cards Grid */}
      {!loading && classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls: any, i: number) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg transition-all"
            >
              {/* Class Info */}
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-blue-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {cls.name?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">{cls.name}</h2>
                  {cls.year && (
                    <p className="text-xs text-slate-500 font-medium">Year: {cls.year}</p>
                  )}
                  {cls.department && (
                    <p className="text-xs text-slate-400">{cls.department}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <Link
                  href={`/teacher/attendance?classId=${cls.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#1e3a5f] text-white hover:bg-[#162d4a] transition-all"
                >
                  <ClipboardCheck size={13} />
                  Attendance
                </Link>
                <Link
                  href={`/teacher/leaderboard?classId=${cls.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-all"
                >
                  <Trophy size={13} />
                  Leaderboard
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {!loading && classes.length > 0 && (
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <Users size={18} />
          </div>
          <p className="text-sm text-slate-600">
            You are assigned to <span className="font-bold text-slate-800">{classes.length}</span> class{classes.length !== 1 ? "es" : ""}.
          </p>
        </div>
      )}
    </div>
  );
}
