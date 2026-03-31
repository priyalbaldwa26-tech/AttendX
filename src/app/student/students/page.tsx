"use client";

import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";

interface Classmate {
  id: string;
  student_id: string;
  user: { name: string; email: string };
}

export default function StudentStudentsPage() {
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClassmates();
  }, []);

  const fetchClassmates = async () => {
    try {
      const res = await fetch("/api/student/classmates");
      if (res.ok) {
        const data = await res.json();
        setClassmates(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const filtered = classmates.filter(
    (c) =>
      c.user.name.toLowerCase().includes(search.toLowerCase()) ||
      c.student_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Students</h2>
          <p className="text-slate-500 text-sm">Students in your class</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Users size={16} />
          {classmates.length} students
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white/60 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
        />
      </div>

      {/* Students Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Scholar No.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-5 w-6 bg-slate-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-48 bg-slate-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-24 bg-slate-100 rounded" /></td>
                  </tr>
                ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No students found.
                </td>
              </tr>
            ) : (
              filtered.map((student, i) => (
                <tr key={student.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-400">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                        {student.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {student.user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      #{student.student_id}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
