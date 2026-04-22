"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  GraduationCap,
  UserCircle,
  CheckCircle2,
  BarChart3,
  Bell,
  Zap,
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  BookOpen,
  ChevronRight,
  Star,
} from "lucide-react";
import AttendXLogo from "@/components/AttendXLogo";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-premium overflow-x-hidden">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-400/12 blur-[140px]" />
        <div className="absolute top-2/3 left-1/2 h-80 w-80 rounded-full bg-pink-300/10 blur-[100px]" />
        <div className="absolute top-0 right-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-[80px]" />
      </div>

      {/* ════════════ NAVBAR ════════════ */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <AttendXLogo size={38} showText textClass="text-xl" />

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#roles" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Roles
          </a>
          <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            How It Works
          </a>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2 rounded-full bg-[#1e3a5f] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 hover:bg-[#162d4a] active:scale-95 transition-all"
        >
          Log in
          <ArrowRight size={15} />
        </Link>
      </nav>

      {/* ════════════ HERO SECTION ════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 rounded-full bg-white/60 border border-slate-200/60 px-4 py-1.5 mb-8 shadow-sm backdrop-blur-sm transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-600">
              Smart Attendance Management System
            </span>
          </div>

          {/* Heading */}
          <h1
            className={`text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Track Attendance{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Smarter
            </span>
            ,<br />
            Not Harder
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Real-time attendance tracking for colleges with smart alerts,
            automated debarment warnings, and beautiful dashboards for admins,
            teachers & students.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              href="/login"
              className="flex items-center gap-2.5 rounded-full bg-[#1e3a5f] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 hover:bg-[#162d4a] active:scale-95 transition-all"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 rounded-full bg-white/70 border border-slate-200 px-8 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-white hover:shadow-md active:scale-95 transition-all backdrop-blur-sm"
            >
              Learn More
              <ChevronRight size={15} />
            </a>
          </div>
        </div>

        {/* ── Hero Stats Cards ── */}
        <div
          className={`mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto transition-all duration-700 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {[
            { icon: Users, label: "Real-time Tracking", value: "Live", color: "text-blue-600", bg: "bg-blue-100" },
            { icon: Bell, label: "Smart Alerts", value: "Auto", color: "text-amber-600", bg: "bg-amber-100" },
            { icon: BarChart3, label: "Analytics", value: "Rich", color: "text-emerald-600", bg: "bg-emerald-100" },
            { icon: Shield, label: "Role-based Access", value: "3 Roles", color: "text-purple-600", bg: "bg-purple-100" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${stat.bg} ${stat.color} mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ FEATURES SECTION ════════════ */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Features</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Everything You Need
          </h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto">
            Powerful features designed to make attendance management effortless and insightful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Real-time Attendance",
              desc: "Mark and track attendance instantly with WebSocket-powered live updates across all devices.",
              color: "from-amber-500 to-orange-500",
              bg: "bg-amber-50",
            },
            {
              icon: Bell,
              title: "Smart Email Alerts",
              desc: "Automated warnings for 5-day absences, monthly absence limits, and debarment risk notifications.",
              color: "from-rose-500 to-pink-500",
              bg: "bg-rose-50",
            },
            {
              icon: BarChart3,
              title: "Rich Analytics",
              desc: "Beautiful charts, subject-wise progress, attendance streaks, and performance leaderboards.",
              color: "from-emerald-500 to-teal-500",
              bg: "bg-emerald-50",
            },
            {
              icon: BookOpen,
              title: "Class Management",
              desc: "Create courses, branches, and classes. Assign students and teachers with a few clicks.",
              color: "from-blue-500 to-cyan-500",
              bg: "bg-blue-50",
            },
            {
              icon: Shield,
              title: "Role-based Access",
              desc: "Dedicated panels for Admin, Teacher, and Student — each with tailored features and permissions.",
              color: "from-purple-500 to-violet-500",
              bg: "bg-purple-50",
            },
            {
              icon: Clock,
              title: "Attendance History",
              desc: "Complete attendance records with date-wise, subject-wise breakdowns and downloadable reports.",
              color: "from-indigo-500 to-blue-500",
              bg: "bg-indigo-50",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div
                className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ ROLES SECTION ════════════ */}
      <section id="roles" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Panels</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Three Powerful Panels
          </h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto">
            Each role gets a customized dashboard with the tools they need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              role: "Admin",
              desc: "Complete control over students, teachers, classes, courses, and system-wide analytics.",
              features: ["Manage Students & Teachers", "Create Classes & Courses", "View Real-time Stats", "System-wide Analytics"],
              gradient: "from-blue-600 to-cyan-500",
              badgeBg: "bg-blue-50 text-blue-700",
            },
            {
              icon: UserCircle,
              role: "Teacher",
              desc: "Mark attendance, generate reports, and track student performance effortlessly.",
              features: ["Mark Attendance Live", "Generate Reports", "View Leaderboard", "Class-wise Analytics"],
              gradient: "from-emerald-500 to-teal-500",
              badgeBg: "bg-emerald-50 text-emerald-700",
            },
            {
              icon: GraduationCap,
              role: "Student",
              desc: "Track your own attendance, view streaks, and get alerts for low attendance.",
              features: ["View Dashboard", "Track Subject Progress", "Attendance Streak", "Debarment Warnings"],
              gradient: "from-purple-500 to-violet-500",
              badgeBg: "bg-purple-50 text-purple-700",
            },
          ].map((panel, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Top Gradient Bar */}
              <div className={`h-2 bg-gradient-to-r ${panel.gradient}`} />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${panel.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <panel.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{panel.role} Panel</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${panel.badgeBg}`}>
                      {panel.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{panel.desc}</p>

                <div className="space-y-2.5">
                  {panel.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-600 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Process</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Login", desc: "Admin, Teacher, or Student logs in with their credentials." },
            { step: "02", title: "Mark", desc: "Teacher marks attendance in real-time via the dashboard." },
            { step: "03", title: "Track", desc: "Students view their attendance, streaks, and subject progress." },
            { step: "04", title: "Alert", desc: "Automated email alerts for low attendance and debarment risks." },
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/80 border border-slate-200 text-slate-900 font-extrabold text-lg mb-4 shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all">
                {item.step}
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ CTA SECTION ════════════ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-20">
        <div className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-80 bg-gradient-to-b from-blue-400/15 to-transparent blur-2xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl mb-6">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Log in to access your personalized dashboard and start tracking attendance efficiently.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#1e3a5f] px-10 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/20 hover:bg-[#162d4a] active:scale-95 transition-all"
            >
              Go to Login
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="relative z-10 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <AttendXLogo size={30} showText textClass="text-base" />

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} AttendX — Smart Attendance Management System
          </p>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
            ))}
            <span className="text-xs text-slate-500 ml-1.5 font-semibold">College Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
