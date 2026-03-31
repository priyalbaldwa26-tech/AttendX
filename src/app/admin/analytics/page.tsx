"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { Bell, TrendingUp } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

export default function AnalyticsPage() {
  // Line chart
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Attendance Trend",
        data: [82, 85, 90, 88, 92, 87],
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20, 184, 166, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#14b8a6",
        pointBorderWidth: 2,
        pointBorderColor: "#fff",
      },
    ],
  };

  // Bar chart
  const barData = {
    labels: ["CS-A", "CS-B", "ECE-A", "ME-A", "CE-A"],
    datasets: [
      {
        label: "Average Attendance %",
        data: [92, 85, 78, 88, 74],
        backgroundColor: ["#3b82f6", "#14b8a6", "#ec4899", "#f59e0b", "#8b5cf6"],
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  };

  // Donut chart
  const doughnutData = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        data: [72, 18, 10],
        backgroundColor: ["#14b8a6", "#ef4444", "#f59e0b"],
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { font: { size: 10 }, color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" } },
      x: { ticks: { font: { size: 10 }, color: "#94a3b8" }, grid: { display: false } },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const, labels: { font: { size: 10 }, color: "#94a3b8", usePointStyle: true, pointStyle: "circle", padding: 12 } },
    },
  };

  const subjectProgress = [
    { name: "Data Structures", pct: 95, color: "bg-blue-500" },
    { name: "Mathematics", pct: 82, color: "bg-cyan-500" },
    { name: "Digital Electronics", pct: 78, color: "bg-emerald-500" },
    { name: "English", pct: 90, color: "bg-amber-500" },
    { name: "Physics", pct: 68, color: "bg-rose-500" },
  ];

  const notifications = [
    "Attendance report generated for March",
    "New students added to CS-A",
    "Low attendance alert: Physics (68%)",
  ];

  const topStudents = [
    { name: "Ganesh", pct: 98 },
    { name: "Meera", pct: 96 },
    { name: "Sumedha", pct: 95 },
    { name: "Tushar", pct: 93 },
    { name: "Riya", pct: 91 },
  ];

  return (
    <div className="h-full w-full space-y-4">
      {/* 3 Chart Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className="glass-card rounded-2xl p-5 cyan-glow-border">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Attendance Trend
          </span>
          <div className="h-40 mt-3">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card rounded-2xl p-5 cyan-glow-border">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Class Comparison
          </span>
          <div className="h-40 mt-3">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass-card rounded-2xl p-5 cyan-glow-border">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Status Distribution
          </span>
          <div className="h-40 mt-3">
            <Doughnut data={doughnutData} options={donutOptions} />
          </div>
        </div>
      </div>

      {/* Subject Progress + Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Progress */}
        <div className="glass-card rounded-2xl p-5 cyan-glow-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-blue-500 dark:text-cyan-400" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Subject Progress
            </span>
          </div>
          <div className="space-y-3">
            {subjectProgress.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {s.name}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {s.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-700`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-2xl p-5 cyan-glow-border">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={15} className="text-blue-500 dark:text-cyan-400" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Notifications
            </span>
          </div>
          <div className="space-y-2.5">
            {notifications.map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 p-2 rounded-lg hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-blue-500 dark:bg-cyan-400" />
                <span>{n}</span>
              </div>
            ))}
          </div>

          {/* Top Students */}
          <div className="mt-5 pt-4 border-t border-slate-200/30 dark:border-slate-700/30">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Top Performers
            </span>
            <div className="flex gap-2 mt-2.5 overflow-x-auto no-scrollbar pb-1">
              {topStudents.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col items-center shrink-0"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow ring-2 ring-white dark:ring-slate-800">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    {s.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
