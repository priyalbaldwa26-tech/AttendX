"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Search, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface StudentReport {
  id: string;
  studentId: string;
  name: string;
  totalClasses: number;
  attended: number;
  absent: number;
  percentage: number;
}

export default function TeacherReportsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [classRes, subjectRes] = await Promise.all([
        fetch("/api/admin/classes"),
        fetch("/api/admin/subjects"),
      ]);
      if (classRes.ok) {
        const data = await classRes.json();
        setClasses(data);
      }
      if (subjectRes.ok) {
        const data = await subjectRes.json();
        setSubjects(data);
      }
    } catch {
      // silent
    }
  };

  const handleSearch = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.error("Please select both Class and Subject");
      return;
    }
    setLoading(true);
    setFetched(false);
    try {
      const res = await fetch(`/api/teacher/reports?classId=${selectedClass}&subjectId=${selectedSubject}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        setFetched(true);
      } else {
        toast.error("Failed to fetch report");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const highAttendance = students.filter(s => s.percentage >= 75);
  const lowAttendance = students.filter(s => s.percentage < 75);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Attendance Reports</h2>
        <p className="text-slate-500 text-sm">Check class-wise student attendance by subject.</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/60 p-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select Class</option>
              {classes.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/60 p-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select Subject</option>
              {subjects.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#162d4a] active:scale-95 disabled:opacity-50 shadow-lg"
            >
              <Search size={16} />
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {fetched && (
        <>
          {students.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <BarChart3 size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm">No attendance records found for this combination.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Attendance (< 75%) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <TrendingDown size={18} className="text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">Low Attendance (&lt; 75%)</h3>
                    <p className="text-[10px] text-slate-400">{lowAttendance.length} students</p>
                  </div>
                </div>

                {lowAttendance.length === 0 ? (
                  <div className="glass-card rounded-2xl p-5 text-center">
                    <p className="text-sm text-emerald-500 font-semibold">🎉 No students with low attendance!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {lowAttendance.map((student) => (
                      <div key={student.id} className="glass-card rounded-xl p-4 hover:shadow-md transition-all border-l-4 border-rose-400">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">#{student.studentId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-extrabold ${student.percentage < 50 ? "text-rose-600" : "text-amber-500"}`}>
                              {student.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-2">
                          <span>Total: <b className="text-slate-700">{student.totalClasses}</b></span>
                          <span>Present: <b className="text-emerald-600">{student.attended}</b></span>
                          <span>Absent: <b className="text-rose-500">{student.absent}</b></span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${student.percentage < 50 ? "bg-rose-500" : "bg-amber-500"}`}
                            style={{ width: `${student.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* High Attendance (>= 75%) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <TrendingUp size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">High Attendance (≥ 75%)</h3>
                    <p className="text-[10px] text-slate-400">{highAttendance.length} students</p>
                  </div>
                </div>

                {highAttendance.length === 0 ? (
                  <div className="glass-card rounded-2xl p-5 text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-500">
                      <AlertTriangle size={16} />
                      <p className="text-sm font-semibold">No students with high attendance.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {highAttendance.map((student) => (
                      <div key={student.id} className="glass-card rounded-xl p-4 hover:shadow-md transition-all border-l-4 border-emerald-400">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">#{student.studentId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-emerald-600">
                              {student.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-2">
                          <span>Total: <b className="text-slate-700">{student.totalClasses}</b></span>
                          <span>Present: <b className="text-emerald-600">{student.attended}</b></span>
                          <span>Absent: <b className="text-rose-500">{student.absent}</b></span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                            style={{ width: `${student.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
