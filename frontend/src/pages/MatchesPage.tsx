import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import api from "../services/api";
import {
  Zap,
  Cpu,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Target,
  Shuffle,
  Grid,
} from "lucide-react";

// --- INTERFACES ---
interface SkillDto {
  skillName: string;
  level: string;
  category?: string;
}

interface MatchUser {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  skills: SkillDto[];
  goal: string;
  trustScore?: number;
}

interface MatchResponse {
  matchId: number;
  score: number;
  status: string;
  matchedUser: MatchUser;
  commonSkills: string[];
  senderId?: number;
  projectId?: number;
  projectSkills?: string[];
}

const DOMAINS = [
  { id: "ALL", label: "All Nodes", icon: Grid },
  { id: "RANDOM", label: "Random Mix", icon: Shuffle },
  { id: "STUDY_BUDDY", label: "Study Buddy", icon: Target },
  { id: "HACKATHON", label: "Hackathon", icon: Target },
  { id: "PROJECT_PARTNER", label: "Project Maker", icon: Target },
];

const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const [allMatches, setAllMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const currentUserId = Number(localStorage.getItem("userId"));

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/matches/find");
      setAllMatches(response.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Match Telemetry Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Neural Filtering & Randomization Logic
  const filteredMatches = useMemo(() => {
    let list = [...allMatches];
    
    if (selectedDomain === "RANDOM") {
      // Shuffle the entire pool for the Random mode
      return list.sort(() => Math.random() - 0.5);
    }
    
    if (selectedDomain !== "ALL") {
      // Stringent domain filtering
      list = list.filter(m => m.matchedUser.goal === selectedDomain);
    }
    
    return list;
  }, [allMatches, selectedDomain]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedDomain]);

  useEffect(() => {
    const handleSync = () => {
      console.log("Neural Handshake Sync Triggered - Refreshing Cluster...");
      fetchMatches();
    };
    window.addEventListener("neural-sync", handleSync);
    return () => window.removeEventListener("neural-sync", handleSync);
  }, []);

  const handleSendRequest = async (match: MatchResponse) => {
    const targetUserId = match.matchedUser.id;
    try {
      await api.post(`/api/matches/${targetUserId}/request`, null, {
        params: {
          projectId: match.projectId,
          fulfilledSkill: selectedSkill
        }
      });
    } catch (err: any) {
      console.error("Request Error:", err);
    }
  };

  const handleAcceptRequest = async (matchId: number) => {
    try {
      await api.put(`/api/matches/${matchId}/accept`, null, {
        params: {
          fulfilledSkill: selectedSkill
        }
      });
    } catch (err: any) {
      console.error("Accept Error:", err);
    }
  };

  const handleSwipe = async (direction: "right" | "left", match: MatchResponse) => {
    if (direction === "right") {
      if (match.status === "PENDING" && match.senderId !== currentUserId) {
        await handleAcceptRequest(match.matchId);
      } else if (match.status === "NONE" || !match.status) {
        await handleSendRequest(match);
      }
    }
    setSelectedSkill(null);
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0B0F1A]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 border-2 border-blue-500/30 rounded-[2rem] flex items-center justify-center mb-6"
        >
          <Cpu className="text-blue-500 w-10 h-10" />
        </motion.div>
        <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">
          Scanning Neural Paths...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 p-6 md:p-12 relative overflow-hidden flex flex-col items-center">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto z-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all mb-2"
            >
              <ArrowLeft size={14} /> Back to Hub
            </button>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">
              Neural <span className="text-blue-500">Discovery</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-blue-400" /> {filteredMatches.length}{" "}
              Nodes in Current Spectrum
            </p>
          </div>

          {/* --- DOMAIN SELECTOR --- */}
          <div className="flex flex-wrap gap-2 bg-black/40 p-2 rounded-[2rem] border border-white/5 backdrop-blur-xl">
            {DOMAINS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all
                  ${selectedDomain === domain.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}
                `}
              >
                <domain.icon size={14} />
                {domain.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- SWIPE ENGINE --- */}
        <div className="relative h-[680px] w-full max-w-lg mx-auto mt-4">
          <AnimatePresence>
            {currentIndex < filteredMatches.length ? (
              filteredMatches.slice(currentIndex, currentIndex + 1).map((match) => (
                <motion.div
                  key={`${selectedDomain}-${match.matchedUser.id}`}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) handleSwipe("right", match);
                    else if (info.offset.x < -100) handleSwipe("left", match);
                  }}
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ 
                    x: (currentIndex % 2 === 0 ? 500 : -500), 
                    opacity: 0, 
                    rotate: (currentIndex % 2 === 0 ? 45 : -45),
                    transition: { duration: 0.4 }
                  }}
                  className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-8 md:p-10 flex flex-col shadow-2xl cursor-grab active:cursor-grabbing group overflow-hidden"
                >
                  {/* Trust Score Badge */}
                  <div className="absolute top-8 left-10">
                     <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                           {match.matchedUser.trustScore || 72}% Trust
                        </span>
                     </div>
                  </div>

                  {/* Sync Score Badge */}
                  <div className="absolute top-8 right-10">
                    <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                      <Zap size={14} className="text-blue-400 fill-blue-400" />
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                        {Math.round(match.score)}% Sync
                      </span>
                    </div>
                  </div>

                  {/* Node Profile */}
                  <div className="flex flex-col items-center mt-12 mb-8 text-center">
                    <div className="relative mb-6">
                       <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.matchedUser.name}`}
                        className="w-32 h-32 rounded-[3.5rem] bg-slate-800 border-2 border-white/10 shadow-emerald-500/5 group-active:scale-95 transition-transform"
                        alt="Avatar"
                      />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center border-4 border-[#0B0F1A]">
                        <Cpu size={18} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
                      {match.matchedUser.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg">
                        {match.matchedUser.goal?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Bio Area */}
                  <div className="bg-white/5 rounded-[2.5rem] p-6 mb-6 border border-white/5 flex-1 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent opacity-30" />
                    <p className="text-slate-200 text-sm font-bold leading-relaxed text-center italic relative z-10 px-4">
                      "
                      {match.matchedUser.bio || "Searching for neural collaboration and high-throughput skill synchronization."}
                      "
                    </p>
                  </div>

                  {/* Shared Specializations */}
                  <div className="space-y-4 mb-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center">
                      Shared Specializations
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                       {match.commonSkills.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-bold text-blue-400 uppercase">
                             {s}
                          </span>
                       ))}
                    </div>
                  </div>

                  {/* Team Requirements / Selective Matching */}
                  {match.projectSkills && match.projectSkills.length > 0 && (
                    <div className="mt-auto p-5 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem]">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 text-center">
                        Apply for Specific Role
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {match.projectSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={(e) => { e.stopPropagation(); setSelectedSkill(skill); }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                              selectedSkill === skill
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                      {selectedSkill && (
                        <p className="text-[9px] text-emerald-400 font-black text-center mt-4 animate-pulse uppercase tracking-widest">
                          Right swipe to fulfill {selectedSkill} role
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-slate-900/40 border border-dashed border-white/10 rounded-[4rem] p-12 flex flex-col items-center justify-center text-center backdrop-blur-xl"
              >
                <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-blue-500/20 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
                   <Sparkles className="text-blue-500" size={48} />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">
                  Cluster Scanned
                </h2>
                <p className="text-slate-400 text-sm font-bold max-w-[280px] leading-relaxed mb-10 uppercase tracking-widest">
                  Neural patterns for the <span className="text-blue-400">{selectedDomain.replace(/_/g, " ")}</span> spectrum have been exhausted.
                </p>
                <button
                  onClick={() => setSelectedDomain("ALL")}
                  className="group relative px-12 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] transition-all hover:bg-blue-500 hover:text-white shadow-2xl active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Reset Spectrum <Zap size={14} className="group-hover:fill-white" />
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
