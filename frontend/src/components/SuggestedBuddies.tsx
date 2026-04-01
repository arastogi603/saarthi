import React, { useState, useEffect } from "react";
import api from "../services/api";
import { UserPlus, Star, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const SuggestedBuddies = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      const res = await api.post("/api/matches/find");
      const mapped = res.data.slice(0, 4).map((m: any) => ({
        name: m.matchedUser.name,
        skill: m.matchedUser.skills?.[0]?.skillName || "Neural Expert",
        match: `${Math.round(m.score)}%`,
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.matchedUser.name}`
      }));
      setSuggestions(mapped);
    } catch (err) {
      console.error("Dashboard Suggestion Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    window.addEventListener("neural-sync", fetchSuggestions);
    return () => window.removeEventListener("neural-sync", fetchSuggestions);
  }, []);

  if (loading && suggestions.length === 0) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-center min-h-[300px]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="text-cyan-500/20" size={32} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full" />
      
      <div className="flex items-center gap-2 mb-8 relative z-10">
        <Star size={14} className="text-cyan-400 fill-cyan-400" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Neural Proximity</h3>
      </div>

      <div className="space-y-6 relative z-10">
        {suggestions.map((buddy, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                 <img src={buddy.img} className="w-11 h-11 rounded-2xl bg-slate-800 border-2 border-white/5 group-hover:rotate-3 transition-transform shadow-xl" alt={buddy.name} />
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B0F1A]" />
              </div>
              <div>
                <p className="text-sm font-black text-white italic tracking-tight uppercase leading-tight">{buddy.name}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{buddy.skill}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Sync</span>
                <span className="text-xs font-black text-cyan-400 italic tracking-tighter">{buddy.match}</span>
              </div>
              <button className="p-2.5 bg-white/5 text-slate-400 rounded-xl border border-white/10 hover:text-white hover:bg-cyan-500 hover:text-black hover:border-transparent transition-all active:scale-90 shadow-lg">
                <UserPlus size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {suggestions.length === 0 && (
          <p className="text-center py-10 text-[10px] font-black text-slate-600 uppercase tracking-widest italic animate-pulse">
            Scanning local nodes...
          </p>
        )}
      </div>
      
      <button className="w-full mt-8 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-xl">
         View Discovery Deck
      </button>
    </div>
  );
};