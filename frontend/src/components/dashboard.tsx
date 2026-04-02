import React, { useState, useEffect, useCallback } from "react";
import { Zap, Cpu, Search, LayoutGrid, Terminal, Sparkles } from "lucide-react";
import { GreetingCard } from "./GreetingCard";
import { DetailedProgress } from "./Detailedprogess";
import { ActiveProjects } from "./ActiveProjects";
import { SuggestedBuddies } from "./SuggestedBuddies";
import { GameCarousel } from "./GameCarousel";
import api from "../services/api";
import { motion } from "framer-motion";

export const DashboardMain: React.FC = () => {
  const [search, setSearch] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await api.get("/api/users/me/metrics");
      setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    window.addEventListener("neural-points-sync", fetchMetrics);
    return () => window.removeEventListener("neural-points-sync", fetchMetrics);
  }, [fetchMetrics]);

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  if (isLoading) {
    return (
      <div className="flex-1 h-screen bg-[#030508] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#030508] text-slate-200 p-6 lg:p-10 relative overflow-hidden selection:bg-cyan-500/30">
      {/* Neural Background Grid & Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full" />
         <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        {/* 1. TOP HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <Cpu size={24} className="text-cyan-500 animate-pulse" />
               <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Neural Hub</h1>
            </div>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-6">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="px-6 py-3 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center gap-3 shadow-2xl group cursor-help"
             >
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-tight">Neural Points</span>
                   <span className="text-lg font-black text-white italic leading-tight">{metrics?.sudokuPoints || 0}</span>
                </div>
                <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl group-hover:bg-cyan-500/20 transition-all">
                   <Zap size={20} className="text-cyan-400 fill-cyan-400" />
                </div>
             </motion.div>

             <div className="relative group">
                <input
                  type="text"
                  placeholder="Scan Nodes..."
                  className="pl-12 pr-6 py-4 bg-slate-900/40 border border-white/5 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all w-full md:w-80 text-white placeholder:text-slate-600 font-medium italic backdrop-blur-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400" />
             </div>
          </div>
        </header>

        {/* 2. GREETING CARD */}
        <GreetingCard />

        {/* 3. BENTO GRID V2 SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN COLUMN (8/12) - THE CORE FLOW */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* HERO: Game Carousel */}
            <div className="w-full">
               <GameCarousel />
            </div>

            {/* SECONDARY: Capability Matrix */}
            <div className="bg-slate-900/40 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500/50" />
               <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Capability Matrix</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Real-time Telemetry</p>
                  </div>
                  <LayoutGrid className="text-cyan-500 opacity-50" size={28} />
               </div>
               <DetailedProgress />
            </div>
          </div>

          {/* SIDEBAR COLUMN (4/12) - THE UTILITY STACK */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Social List */}
            <SuggestedBuddies />

            {/* Active Projects (Migrated for Space) */}
            <div className="min-h-[220px]">
               <ActiveProjects />
            </div>

            {/* Neural Syncing Mini-Card */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl group overflow-hidden relative min-h-[200px]"
            >
               <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />
               <div className="space-y-2 relative z-10">
                  <h4 className="text-2xl font-black italic uppercase leading-tight tracking-tighter">
                  Neural Syncing
                  </h4>
                  <p className="text-xs font-bold opacity-70">Find a peer study session instantly.</p>
               </div>
               <button className="bg-white text-blue-600 w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all active:scale-95 shadow-xl mt-6 relative z-10">
                  Explore Rooms
               </button>
            </motion.div>

            {/* System Signals */}
            <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                 <Terminal size={14} className="text-cyan-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    System Signals
                 </h3>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Sync Complete", detail: "Node connected with Aryan_Proto", time: "2m ago", active: true },
                  { label: "Repo Init", detail: "New sector React_Pulse initialized", time: "1h ago", active: false }
                ].map((signal, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`w-0.5 h-8 ${signal.active ? "bg-cyan-500" : "bg-slate-800"} rounded-full group-hover:h-full transition-all`} />
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                        <span className="text-white uppercase italic font-black">{signal.label}:</span> {signal.detail}
                      </p>
                      <span className="text-[9px] text-slate-600 font-black tracking-widest uppercase">{signal.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neural Streak */}
            <div className="p-8 bg-gradient-to-tr from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
               <Sparkles size={80} className="absolute -bottom-6 -right-6 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
               <p className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">Neural Streak</p>
               <h2 className="text-6xl font-black text-white italic tracking-tighter mt-2">{metrics?.streak || "0"}</h2>
               <p className="text-xs font-bold text-slate-500 mt-2 italic">Days Active</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
