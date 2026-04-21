"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Search, AlertTriangle, Mail, Loader2, CheckCircle, XCircle, Send } from "lucide-react";
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

interface DebarredStudent {
  name: string;
  studentId: string;
  percentage: number;
  totalClasses: number;
  attended: number;
  absent: number;
}

interface MonthlyReportResult {
  success: boolean;
  debarredCount: number;
  emailsSent: number;
  emailsFailed: number;
  debarredStudents: DebarredStudent[];
  error?: string;
}

export default function TeacherReportsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // Monthly report state
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportResult, setReportResult] = useState<MonthlyReportResult | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

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

  const handleGenerateMonthlyReport = async () => {
    setGeneratingReport(true);
    setReportResult(null);
    try {
      const res = await fetch("/api/alerts/monthly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: reportMonth, year: reportYear }),
      });
      const data = await res.json();
      setReportResult(data);
      setShowReportModal(true);
      if (data.success && data.debarredCount > 0) {
        toast.success(`Report generated! ${data.debarredCount} student(s) debarred`);
      } else if (data.success && data.debarredCount === 0) {
        toast.success("No students below 75% — All clear! 🎉");
      } else {
        toast.error(data.error || "Failed to generate report");
      }
    } catch {
      toast.error("Failed to generate monthly report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const highAttendance = students.filter(s => s.percentage >= 75);
  const lowAttendance = students.filter(s => s.percentage < 75);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Attendance Reports</h2>
        <p className="text-slate-500 text-sm">Check class-wise student attendance by subject.</p>
      </div>

      {/* ──── Monthly Debarred Report Section ──── */}
      <div className="glass-card rounded-2xl p-5 border-l-4 border-rose-400">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Monthly Debarred Report & Alerts</h3>
            <p className="text-xs text-slate-500">
              Generate debarred list ({"<"}75%) and send email alerts to students & teachers.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Month
            </label>
            <select
              value={reportMonth}
              onChange={(e) => setReportMonth(parseInt(e.target.value))}
              className="rounded-xl border border-slate-200 bg-white/60 p-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {monthNames.map((name, i) => (
                <option key={i} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Year
            </label>
            <select
              value={reportYear}
              onChange={(e) => setReportYear(parseInt(e.target.value))}
              className="rounded-xl border border-slate-200 bg-white/60 p-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerateMonthlyReport}
            disabled={generatingReport}
            className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose-600 active:scale-95 disabled:opacity-50 shadow-lg"
          >
            {generatingReport ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send size={16} />
                Generate Report & Send Alerts
              </>
            )}
          </button>
        </div>
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

      {/* ──── Monthly Report Result Modal ──── */}
      {showReportModal && reportResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">
                  📋 Monthly Debarred Report
                </h3>
                <p className="text-rose-100 text-xs mt-0.5">
                  {monthNames[reportMonth - 1]} {reportYear}
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-rose-600">
                  {reportResult.debarredCount}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Debarred</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-emerald-600">
                  {reportResult.emailsSent}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Emails Sent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-amber-600">
                  {reportResult.emailsFailed}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Failed</p>
              </div>
            </div>

            {/* Student List */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {reportResult.debarredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <CheckCircle size={48} className="text-emerald-400 mb-3" />
                  <p className="text-lg font-bold text-slate-700">All Clear! 🎉</p>
                  <p className="text-sm text-slate-400">No students below 75% attendance.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reportResult.debarredStudents.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-bold text-xs shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">#{s.studentId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500">
                          {s.attended}/{s.totalClasses}
                        </span>
                        <span className={`font-extrabold text-lg ${s.percentage < 50 ? "text-rose-600" : "text-amber-500"}`}>
                          {s.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="px-6 py-4 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setShowReportModal(false)}
                className="w-full rounded-xl bg-[#1e3a5f] py-3 font-bold text-white hover:bg-[#162d4a] transition-all active:scale-95 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
