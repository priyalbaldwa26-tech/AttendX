"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Users, Award, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";

interface LeaderboardEntry {
  id: string;
  studentId: string;
  name: string;
  avatar: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  rank: number;
}

export default function TeacherLeaderboardPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [topPerformers, setTopPerformers] = useState<LeaderboardEntry[]>([]);
  const [bottomPerformers, setBottomPerformers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/teacher/assignments");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setAssignments(data);
        const uniqueClasses = Array.from(
          new Map(data.map((item: any) => [item.class.id, item.class])).values()
        ) as any[];
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) {
          setSelectedClass(uniqueClasses[0].id);
        }
      }
    } catch {
      toast.error("Failed to load assignments");
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchLeaderboard();
    }
  }, [selectedClass]);

  const fetchLeaderboard = async () => {
    if (!selectedClass) return;
    setLoading(true);
    setFetched(false);
    try {
      const res = await fetch(`/api/teacher/leaderboard?classId=${selectedClass}`);
      if (res.ok) {
        const data = await res.json();
        setTopPerformers(data.top || []);
        setBottomPerformers(data.bottom || []);
        setFetched(true);
      } else {
        toast.error("Failed to load leaderboard");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const selectedClassName = classes.find((c) => c.id === selectedClass)?.name || "";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Leaderboard</h1>
        <p className="text-slate-500">Track Top 5 and Bottom 5 attendance performers in your assigned classes.</p>
      </header>

      {/* Class Selector */}
      <div className="glass-card rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/60 p-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {classes.length === 0 && <option value="">No Classes Assigned</option>}
              {classes.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.year})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold">
              <BarChart3 size={16} />
              {selectedClassName || "Select a class"}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-4">
              {Array(5).fill(0).map((_, j) => (
                <div key={j} className="h-20 rounded-2xl bg-white animate-pulse shadow-sm border border-slate-100" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {fetched && !loading && (
        <>
          {topPerformers.length === 0 && bottomPerformers.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <BarChart3 size={40} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-600 mb-1">No Attendance Data Yet</h3>
              <p className="text-sm text-slate-400">
                Submit attendance for this class to see leaderboard rankings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top 5 Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <Trophy className="text-amber-500" size={24} />
                  Top 5 Performers
                </h3>
                <div className="space-y-4">
                  {topPerformers.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 hover:border-amber-200 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-black">
                          {p.avatar}
                          {p.rank <= 3 && (
                            <div className="absolute -top-2 -left-2 rounded-full bg-amber-400 p-1 text-white shadow-sm">
                              <Award size={12} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-400">
                            Rank #{p.rank} · {p.attended}/{p.totalClasses} classes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-emerald-600 font-black">
                          <TrendingUp size={16} />
                          {p.percentage}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom 5 Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <Users className="text-rose-500" size={24} />
                  Bottom 5 Performers
                </h3>
                <div className="space-y-4">
                  {bottomPerformers.length === 0 ? (
                    <div className="glass-card rounded-2xl p-5 text-center">
                      <p className="text-sm text-emerald-500 font-semibold">
                        🎉 Not enough data for bottom performers yet!
                      </p>
                    </div>
                  ) : (
                    bottomPerformers.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 hover:border-rose-200 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 font-black group-hover:bg-rose-50 group-hover:text-rose-400 transition-colors">
                            {p.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-xs text-slate-400">
                              Rank #{p.rank} · {p.attended}/{p.totalClasses} classes
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-rose-500 font-black">
                            <TrendingDown size={16} />
                            {p.percentage}%
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
