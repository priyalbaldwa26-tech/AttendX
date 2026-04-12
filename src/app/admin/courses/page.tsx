"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Edit2, Trash2, BookOpen, GitBranch, AlertTriangle,
  ChevronDown, ChevronRight, Search
} from "lucide-react";
import toast from "react-hot-toast";

interface Branch {
  id: string;
  name: string;
  course_id: string;
}

interface Course {
  id: string;
  name: string;
  branches: Branch[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Course modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<"add" | "edit">("add");
  const [courseForm, setCourseForm] = useState({ id: "", name: "" });

  // Branch modal
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchModalMode, setBranchModalMode] = useState<"add" | "edit">("add");
  const [branchForm, setBranchForm] = useState({ id: "", name: "", courseId: "" });

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "course" | "branch"; id: string; name: string } | null>(null);

  // Expanded courses
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      setCourses(data);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleExpand = (courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  // ─── COURSE HANDLERS ────────────────────────────
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = courseModalMode === "edit";
      const res = await fetch("/api/admin/courses", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseForm),
      });

      if (res.ok) {
        toast.success(`Course ${isEdit ? "updated" : "created"} successfully!`);
        setShowCourseModal(false);
        setCourseForm({ id: "", name: "" });
        fetchCourses();
      } else {
        const errText = await res.text();
        toast.error(errText || "Failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  // ─── BRANCH HANDLERS ────────────────────────────
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = branchModalMode === "edit";
      const res = await fetch("/api/admin/branches", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branchForm),
      });

      if (res.ok) {
        toast.success(`Branch ${isEdit ? "updated" : "created"} successfully!`);
        setShowBranchModal(false);
        setBranchForm({ id: "", name: "", courseId: "" });
        fetchCourses();
      } else {
        const errText = await res.text();
        toast.error(errText || "Failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  // ─── DELETE HANDLER ──────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const endpoint =
        deleteTarget.type === "course"
          ? `/api/admin/courses?id=${deleteTarget.id}`
          : `/api/admin/branches?id=${deleteTarget.id}`;
      const res = await fetch(endpoint, { method: "DELETE" });

      if (res.ok) {
        toast.success(`${deleteTarget.type === "course" ? "Course" : "Branch"} deleted!`);
        setShowDeleteModal(false);
        setDeleteTarget(null);
        fetchCourses();
      } else {
        const errText = await res.text();
        toast.error(errText || "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.branches?.some((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const courseColors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-sky-600",
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Course & Branch Management
          </h1>
          <p className="text-slate-500">
            Manage courses and their branches. These will appear as options when adding students.
          </p>
        </div>
        <button
          onClick={() => {
            setCourseModalMode("add");
            setCourseForm({ id: "", name: "" });
            setShowCourseModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-95 shadow-lg shadow-violet-200"
        >
          <Plus size={18} />
          Add Course
        </button>
      </header>

      {/* Search */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search courses or branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white animate-pulse shadow-sm border border-slate-100" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white shadow-sm border border-slate-100">
            <div className="h-20 w-20 rounded-3xl bg-violet-50 text-violet-400 flex items-center justify-center mb-4">
              <BookOpen size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No courses yet</h3>
            <p className="text-sm text-slate-400 mb-4">Create your first course to start adding branches.</p>
            <button
              onClick={() => {
                setCourseModalMode("add");
                setCourseForm({ id: "", name: "" });
                setShowCourseModal(true);
              }}
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              Create Course
            </button>
          </div>
        ) : (
          filtered.map((course, i) => {
            const isExpanded = expandedCourses.has(course.id);
            const colorClass = courseColors[i % courseColors.length];

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md"
              >
                {/* Course Header */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer group"
                  onClick={() => toggleExpand(course.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${colorClass} text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
                      {course.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{course.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {course.branches?.length || 0} branch{(course.branches?.length || 0) !== 1 ? "es" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBranchModalMode("add");
                        setBranchForm({ id: "", name: "", courseId: course.id });
                        setShowBranchModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-100 transition-colors"
                      title="Add Branch"
                    >
                      <GitBranch size={13} />
                      Add Branch
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCourseModalMode("edit");
                        setCourseForm({ id: course.id, name: course.name });
                        setShowCourseModal(true);
                      }}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                      title="Edit Course"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ type: "course", id: course.id, name: course.name });
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-50 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 size={15} />
                    </button>
                    <div className={`p-1.5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>

                {/* Branches List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        {(!course.branches || course.branches.length === 0) ? (
                          <div className="text-center py-6 text-sm text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            No branches yet. Click &quot;Add Branch&quot; to create one.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {course.branches.map((branch, bi) => (
                              <motion.div
                                key={branch.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: bi * 0.04 }}
                                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 group/branch hover:border-violet-200 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                                    <GitBranch size={14} />
                                  </div>
                                  <span className="text-sm font-semibold text-slate-700">
                                    {branch.name}
                                  </span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover/branch:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setBranchModalMode("edit");
                                      setBranchForm({ id: branch.id, name: branch.name, courseId: course.id });
                                      setShowBranchModal(true);
                                    }}
                                    className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteTarget({ type: "branch", id: branch.id, name: branch.name });
                                      setShowDeleteModal(true);
                                    }}
                                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ═══ COURSE MODAL ═══ */}
      <AnimatePresence>
        {showCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {courseModalMode === "add" ? "Add New Course" : "Edit Course"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {courseModalMode === "add" ? "e.g. B.Tech, BCA, MBA" : "Update the course name"}
                  </p>
                </div>
                <button
                  onClick={() => setShowCourseModal(false)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Course Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
                    className="flex-1 rounded-xl bg-slate-100 p-3 font-semibold text-slate-600 transition-all hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-violet-600 p-3 font-bold text-white transition-all hover:bg-violet-700 shadow-lg shadow-violet-100 active:scale-95"
                  >
                    {courseModalMode === "add" ? "Create Course" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ BRANCH MODAL ═══ */}
      <AnimatePresence>
        {showBranchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {branchModalMode === "add" ? "Add New Branch" : "Edit Branch"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {branchModalMode === "add"
                      ? `Add a branch under ${courses.find(c => c.id === branchForm.courseId)?.name || "this course"}`
                      : "Update the branch name"}
                  </p>
                </div>
                <button
                  onClick={() => setShowBranchModal(false)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBranch} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Branch Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBranchModal(false)}
                    className="flex-1 rounded-xl bg-slate-100 p-3 font-semibold text-slate-600 transition-all hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-violet-600 p-3 font-bold text-white transition-all hover:bg-violet-700 shadow-lg shadow-violet-100 active:scale-95"
                  >
                    {branchModalMode === "add" ? "Create Branch" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ DELETE MODAL ═══ */}
      <AnimatePresence>
        {showDeleteModal && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Delete {deleteTarget.type === "course" ? "Course" : "Branch"}?
                </h3>
                <p className="text-sm text-slate-500 mb-2">
                  Are you sure you want to delete <span className="font-bold text-slate-700">{deleteTarget.name}</span>?
                </p>
                {deleteTarget.type === "course" && (
                  <p className="text-xs text-amber-600 font-medium mb-4 bg-amber-50 px-3 py-2 rounded-lg">
                    ⚠️ All branches under this course will also be deleted.
                  </p>
                )}
                <div className="flex w-full gap-3 mt-2">
                  <button
                    onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                    className="flex-1 rounded-xl bg-slate-100 p-3 font-semibold text-slate-600 transition-all hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 rounded-xl bg-rose-600 p-3 font-bold text-white transition-all hover:bg-rose-700 shadow-lg shadow-rose-100 active:scale-95"
                  >
                    Delete Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
