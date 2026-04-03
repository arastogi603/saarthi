import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router"; // Assumes you are using React Router
import api from "../services/api";
import {
  User,
  Zap,
  Bell,
  Settings,
  CheckCircle2,
  Clock,
  Flame,
  LayoutGrid,
  ShieldCheck,
  Globe,
  Mail,
  LogOut,
  Share2,
  Check,
} from "lucide-react";

// --- INTERFACES ---
interface UserProfile {
  name: string;
  email: string;
  skills: { skillName: string; level: string }[];
  goal?: string;
  skillLevel?: string;
}

interface PeerRequest {
  id: number;
  nodeName: string;
  similarity: number;
  senderUserId: number;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [requests, setRequests] = useState<PeerRequest[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch Profile
        const profileRes = await api.get("/api/users/me");
        setUserData(profileRes.data);

        // Fetch Metrics
        const metricsRes = await api.get("/api/users/me/metrics");
        setMetrics(metricsRes.data);

        // Fetch Pending Matches
        const matchesRes = await api.get("/api/matches/pending");
        // Map backend MatchResponse to PeerRequest
        const mappedRequests = matchesRes.data.map((m: any) => ({
          id: m.matchId,
          nodeName: m.matchedUser.name,
          similarity: Math.round(m.score),
          senderUserId: m.matchedUser.id
        }));
        setRequests(mappedRequests);

        setError(false);
      } catch (err) {
        console.error("Neural Link Failure:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- BUTTON FUNCTIONALITIES ---

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear JWT
    navigate("/login");
  };

  const handleShare = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleEdit = () => {
    // Redirect to your Matchmaking/Skills engine to "Edit" profile
    navigate("/connect"); 
  };

  const handleRequestAction = async (id: number, action: "authorize" | "drop", senderUserId?: number) => {
    try {
      if (action === "authorize") {
        await api.put(`/api/matches/${id}/accept`);

        // Create or get a private chat room with the sender
        if (senderUserId) {
          try {
            const roomRes = await api.post(`/api/chat/rooms/private/${senderUserId}`);
            navigate(`/chat/${roomRes.data.id}`);
          } catch {
            navigate("/chat");
          }
        } else {
          navigate("/chat");
        }
      } else {
        await api.put(`/api/matches/${id}/reject`);
        setRequests((prev) => prev.filter((req) => req.id !== id));
      }
    } catch (err) {
      console.error("Failed to process request:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0B0F1A]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-blue-500 font-black uppercase tracking-[0.3em] animate-pulse">
          Syncing Node...
        </p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0B0F1A] p-6 text-center">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] max-w-md">
          <ShieldCheck size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-white font-black uppercase italic text-xl">
            Uplink Terminated
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Your session has desynced from the Spring Boot core.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-8 py-3 bg-white text-black font-black rounded-xl uppercase text-xs"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER ACTIONS --- */}
        <div className="flex justify-end gap-4 mb-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl font-black text-[10px] uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
          >
            Disconnect <LogOut size={14} />
          </button>
        </div>

        {/* --- TOP ROW: BENTO HEADER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-10"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-20 -mt-20" />

            <div className="relative group shrink-0">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 bg-gradient-to-tr from-blue-600 via-cyan-400 to-purple-600 opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"
              />
              <div className="relative w-40 h-40 rounded-[3rem] bg-slate-900 border-4 border-white/5 p-1 overflow-hidden shadow-2xl">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`}
                  alt="Avatar"
                  className="w-full h-full rounded-[2.5rem] bg-blue-600 object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
                    {userData.name}
                  </h1>
                  <div className="px-4 py-1.5 bg-blue-600 text-black text-[10px] font-black uppercase rounded-full tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    {userData.skillLevel || "Node_Active"}
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 font-bold text-sm">
                  <span className="flex items-center gap-1"><Mail size={14} /> {userData.email}</span>
                  <span className="flex items-center gap-1"><Globe size={14} /> 0x-Global</span>
                </div>
              </div>

              <p className="text-slate-300 font-medium text-xl max-w-xl italic">
                "{userData.goal || "Synthesizing new project nodes."}"
              </p>

              <div className="flex flex-wrap gap-2 pt-4 justify-center md:justify-start">
                {userData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl shadow-sm group hover:border-blue-500/50 transition-colors"
                  >
                    <span className="text-xs font-black text-white uppercase tracking-tight">{skill.skillName}</span>
                    <span className="text-[9px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md font-black uppercase border border-blue-500/20">{skill.level}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-col lg:flex-col xl:flex-row gap-3 w-full md:w-auto shrink-0">
               <button 
                 onClick={handleEdit}
                 className="flex-1 p-5 bg-white text-black rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white transition-all shadow-xl group"
               >
                 Configuration <Settings size={18} className="group-hover:rotate-90 transition-transform" />
               </button>
               <button 
                 onClick={handleShare}
                 className={`flex-1 p-5 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all ${
                   isCopied 
                     ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" 
                     : "bg-slate-800/50 border-white/5 text-white hover:bg-white hover:text-black"
                 }`}
               >
                 {isCopied ? "Synced" : "Share Hub"} 
                 {isCopied ? <Check size={18} /> : <Share2 size={18} />}
               </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group"
          >
            <Flame className="absolute -right-8 -top-8 w-48 h-48 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Uplink Streak</p>
            <div>
              <h2 className="text-8xl font-black italic tracking-tighter leading-none">{metrics?.streak || 0}</h2>
              <p className="text-sm font-bold opacity-80 mt-2">Days of Neural Sync</p>
            </div>
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center cursor-pointer hover:bg-white/20 transition-all">
              Claim Daily <Zap size={10} className="inline ml-1" />
            </div>
          </motion.div>
        </div>

        {/* --- BOTTOM ROW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-xl">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h3 className="text-3xl font-black tracking-tight uppercase italic">Capability Matrix</h3>
                  <p className="text-slate-500 text-sm font-bold mt-1">Real-time telemetry from AI engine</p>
                </div>
                <LayoutGrid className="text-blue-500" size={32} />
              </div>

              <div className="space-y-10">
                {(metrics?.capabilityMatrix || [
                  { label: "Neural Patterning", val: 0, color: "bg-blue-500" },
                  { label: "Data Architecture", val: 0, color: "bg-indigo-500" },
                  { label: "Logic Synthesis", val: 0, color: "bg-cyan-400" }
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between mb-4 items-end">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-300">{item.label}</span>
                      <span className="text-[10px] font-black bg-white/5 px-3 py-1 rounded-lg border border-white/5">{item.val}% SYNC</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full p-0.5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} transition={{ duration: 2, ease: "circOut" }} className={`h-full ${item.color} rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Clock, val: metrics?.syncTime || "0h", label: "Sync Time" },
                { icon: CheckCircle2, val: metrics?.nodesFixed || "0", label: "Nodes Fixed" },
                { icon: Zap, val: metrics?.throughput || "0%", label: "Throughput" },
                { icon: Bell, val: metrics?.signals || "0", label: "Signals" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] text-center shadow-lg hover:border-blue-500/30 transition-all group">
                  <stat.icon className="mx-auto mb-3 text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-2xl font-black text-white">{stat.val}</p>
                  <p className="text-[9px] uppercase text-slate-500 font-black tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Requests Panel (Functional) */}
          <motion.div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-xl flex flex-col">
            <div className="mb-10">
              <h3 className="text-3xl font-black tracking-tight uppercase italic">Uplink Queue</h3>
              <p className="text-slate-500 text-sm font-bold mt-1">Pending peer authorizations</p>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[300px]">
              <AnimatePresence>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:bg-blue-600/10 transition-colors">
                          <User size={20} className="text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white italic uppercase tracking-tight">{req.nodeName}</p>
                          <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Similarity: {req.similarity}%</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleRequestAction(req.id, "authorize", req.senderUserId)}
                          className="flex-1 py-3 bg-blue-600 text-black text-[10px] font-black uppercase rounded-xl hover:bg-white transition-all active:scale-95"
                        >
                          Authorize
                        </button>
                        <button 
                          onClick={() => handleRequestAction(req.id, "drop")}
                          className="flex-1 py-3 bg-slate-800 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all active:scale-95"
                        >
                          Drop
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                    <CheckCircle2 size={48} />
                    <p className="text-xs font-black uppercase tracking-[0.2em]">Queue Clear</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => navigate("/matches")}
              className="mt-10 w-full py-5 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-500 text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all active:scale-95"
            >
              Discover More Nodes
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ProfilePage;