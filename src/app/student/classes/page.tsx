"use client";

import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Calendar } from "lucide-react";

interface ClassInfo {
  id: string;
  name: string;
  department: string;
  year: string;
}

interface SubjectInfo {
  id: string;
  name: string;
  code: string;
  teacher: string;
}

export default function StudentClassesPage() {
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/student/classes");
      if (res.ok) {
        const data = await res.json();
        setClassInfo(data.class);
        setSubjects(data.subjects);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-2xl bg-white/40 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Class Info Card */}
      {classInfo ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <GraduationCap size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{classInfo.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{classInfo.department || "Department"}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Academic Year: {classInfo.year}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 text-center">
          <p className="text-slate-400">No class assigned yet.</p>
        </div>
      )}

      {/* Subjects */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
          Subjects ({subjects.length})
        </h3>

        {subjects.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No subjects assigned to this class yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub, i) => {
              const colors = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-emerald-500 to-teal-500",
                "from-amber-500 to-orange-500",
                "from-indigo-500 to-violet-500",
                "from-rose-500 to-red-500",
              ];
              return (
                <div
                  key={sub.id}
                  className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}>
                      {sub.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{sub.name}</h4>
                      <p className="text-xs font-mono text-slate-400">{sub.code}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Teacher</p>
                    <p className="text-sm font-semibold text-slate-600">{sub.teacher}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
