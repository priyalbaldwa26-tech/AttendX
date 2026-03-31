"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Users } from "lucide-react";

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);

  // Mock data for top/bottom performers
  const topPerformers = [
    { name: "John Doe", percentage: 99.1, rank: 1, avatar: "JD" },
    { name: "Jane Smith", percentage: 98.5, rank: 2, avatar: "JS" },
    { name: "Alice White", percentage: 97.8, rank: 3, avatar: "AW" },
    { name: "Bob Brown", percentage: 96.2, rank: 4, avatar: "BB" },
    { name: "Charlie Green", percentage: 95.5, rank: 5, avatar: "CG" },
  ];

  const bottomPerformers = [
    { name: "Dave Miller", percentage: 68.4, rank: 40, avatar: "DM" },
    { name: "Eva Long", percentage: 65.2, rank: 41, avatar: "EL" },
    { name: "Frank Sinatra", percentage: 62.1, rank: 42, avatar: "FS" },
    { name: "Grace Kelly", percentage: 58.9, rank: 43, avatar: "GK" },
    { name: "Hank Pym", percentage: 55.4, rank: 44, avatar: "HP" },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Leaderboard</h1>
        <p className="text-slate-500">Track Top 5 and Bottom 5 attendance performers in your class.</p>
      </header>

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
                key={p.name}
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
                    <p className="text-xs text-slate-400">Rank #{p.rank}</p>
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
            {bottomPerformers.map((p, i) => (
              <motion.div
                key={p.name}
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
                    <p className="text-xs text-slate-400">Rank #{p.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-rose-500 font-black">
                    <TrendingDown size={16} />
                    {p.percentage}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
