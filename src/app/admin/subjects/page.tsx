"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, BookOpen, X } from "lucide-react";
import toast from "react-hot-toast";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    sem: "",
    year: "2024"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Subject created successfully!");
        setShowModal(false);
        setFormData({ name: "", code: "", sem: "", year: "2024" });
        fetchData();
      } else {
        toast.error("Failed to create subject");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Subject Management</h1>
          <p className="text-slate-500">Configure academic subjects, their codes, and target semesters.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200"
        >
          <Plus size={18} />
          Create New Subject
        </button>
      </header>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 rounded-[32px] bg-white animate-pulse shadow-sm border border-slate-100" />
          ))
        ) : (
          subjects.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-[32px] bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Sem {sub.sem || "N/A"}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-2">{sub.name}</h3>
                <p className="text-sm font-mono font-medium text-slate-400 mb-6">{sub.code}</p>
              </div>

              <div className="flex items-center pt-4 border-t border-slate-50 justify-between">
                 <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Year</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {sub.year || "N/A"}
                  </p>
                </div>
              </div>

              <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-400 hover:bg-rose-50 rounded-xl">
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Add New Subject</h3>
                  <p className="text-sm text-slate-500">Provide details for the new subject.</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSubject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Subject Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Data Structures"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Subject Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS201"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Semester</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3"
                      value={formData.sem}
                      onChange={(e) => setFormData({ ...formData, sem: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Year</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2nd Year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-xl bg-slate-100 p-3 font-semibold text-slate-600 transition-all hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-indigo-600 p-3 font-bold text-white transition-all shadow-lg shadow-indigo-100 active:scale-95 hover:bg-indigo-700"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
