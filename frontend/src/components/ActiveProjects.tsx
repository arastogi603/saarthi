import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Code2, ArrowUpRight, Loader2, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const ActiveProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.post("/api/matches/find");
      const mapped = res.data
        .filter((m: any) => m.matchedUser.goal === "PROJECT_PARTNER")
        .slice(0, 1)
        .map((m: any) => ({
          name: m.matchedUser.name + "'s Cluster",
          skill: m.matchedUser.skills?.[0]?.skillName || "Tech Stack Unspecified",
          match: `${Math.round(m.score)}% Sync`
        }));
      setProjects(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    window.addEventListener("neural-sync", fetchProjects);
    return () => window.removeEventListener("neural-sync", fetchProjects);
  }, []);

  if (loading && projects.length === 0) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-center min-h-[220px]">
         <Loader2 className="animate-spin text-cyan-400" size={24} />
      </div>
    );
  }

  const proj = projects[0] || { name: "Neural Cluster Omega", skill: "Awaiting Sync...", match: "0%" };

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] text-white border border-white/5 overflow-hidden relative group h-full flex flex-col justify-between shadow-2xl">
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
            <Code2 size={22} className="text-cyan-400" />
          </div>
          <button className="text-slate-500 hover:text-white hover:bg-white/5 p-2 rounded-xl transition-all">
            <ArrowUpRight size={20} />
          </button>
        </div>
        <h4 className="text-2xl font-black italic leading-tight mb-1 truncate uppercase tracking-tighter">
          {proj.name}
        </h4>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 italic">
          {proj.skill}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-8 relative z-10">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i + (proj.name || "")}`}
              className="w-10 h-10 rounded-2xl border-4 border-[#0B0F1A] bg-slate-800 shadow-xl"
              alt=""
            />
          ))}
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Neural Sync</span>
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
             <Zap size={12} className="text-cyan-400 fill-cyan-400" />
             <span className="text-xs font-black text-white italic tracking-tighter">
               {proj.match}
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};
