import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  Users,
  MoreVertical,
  Search,
  ArrowRight,
  Zap,
  MessageSquare,
  ShieldCheck,
  X,
  Flame,
  LayoutGrid,
} from "lucide-react";

// --- LAG-PROOF CSS BACKGROUND ---
const StaticBackground = () => (
  <div className="fixed inset-0 -z-10 bg-[#f8fafc] dark:bg-[#0a0a0a]">
    <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(circle_at_0%_0%,#4f46e5_0,transparent_25%),radial-gradient(circle_at_100%_0%,#3b82f6_0,transparent_25%),radial-gradient(circle_at_100%_100%,#2dd4bf_0,transparent_25%),radial-gradient(circle_at_0%_100%,#8b5cf6_0,transparent_25%)]" />
    <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
  </div>
);

export const SessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [sessions, setSessions] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // Profile Modal State
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [modalProfile, setModalProfile] = useState<any>(null);
  const [modalMetrics, setModalMetrics] = useState<any>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [sessRes, matchRes, pendingRes] = await Promise.all([
        api.get("/api/sessions"),
        api.get("/api/matches").catch(() => ({ data: [] })),
        api.get("/api/matches/pending").catch(() => ({ data: [] })),
      ]);
      
      setSessions(sessRes.data);
      
      // Filter for accepted connections
      const accepted = matchRes.data.filter((m: any) => m.status === "ACCEPTED");
      setConnections(accepted);
      setPendingRequests(pendingRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Listen for real-time sync signals from other tabs/actions
  useEffect(() => {
    window.addEventListener("neural-sync", fetchDashboardData);
    return () => window.removeEventListener("neural-sync", fetchDashboardData);
  }, [fetchDashboardData]);

  const handleJoin = async (id: number) => {
    try {
      await api.post(`/api/sessions/${id}/join`);
      alert("Successfully joined the session!");
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, attendees: s.attendees + 1 } : s))
      );
    } catch (err) {
      console.error("Failed to join session:", err);
      alert("Error joining session.");
    }
  };

  const handleAcceptRequest = async (matchId: number) => {
    try {
      await api.put(`/api/matches/${matchId}/accept`);
      // Optimistically remove from pending and add to connections
      const acceptedMatch = pendingRequests.find(r => r.matchId === matchId);
      if (acceptedMatch) {
         setPendingRequests(prev => prev.filter(r => r.matchId !== matchId));
         setConnections(prev => [...prev, { ...acceptedMatch, status: "ACCEPTED" }]);
      }
      alert("Neural connection established! You can now chat in the Uplink.");
    } catch (err: any) {
      console.error("Accept Error:", err);
      alert(err.response?.data || "Failed to establish connection.");
    }
  };

  const initiateUplink = async (userId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening profile modal
    try {
      const roomRes = await api.post(`/api/chat/rooms/private/${userId}`);
      navigate(`/chat/${roomRes.data.id}`);
    } catch (err) {
      console.error("Uplink Error:", err);
      alert("Failed to initiate uplink. Try again.");
    }
  };

  const openProfileModal = async (userId: number) => {
    setSelectedUserId(userId);
    setIsModalLoading(true);
    setModalProfile(null);
    setModalMetrics(null);

    try {
      const [profRes, metRes] = await Promise.all([
        api.get(`/api/users/${userId}`),
        api.get(`/api/users/${userId}/metrics`).catch(() => ({ data: null })),
      ]);
      setModalProfile(profRes.data);
      if (metRes.data) setModalMetrics(metRes.data);
    } catch (err) {
      console.error("Failed to fetch user details", err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const getStatus = (session: any) => {
    const now = new Date();
    const start = new Date(session.startTime);
    if (now >= start) return "Live";
    return "Upcoming";
  };

  const filteredSessions = sessions.filter((s) => {
    const status = getStatus(s);
    return filter === "All" ? true : status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="relative min-h-screen font-sans selection:bg-blue-100">
      <StaticBackground />

      {/* --- PROFILE MODAL --- */}
      <AnimatePresence>
        {selectedUserId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedUserId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedUserId(null)}
                className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {isModalLoading ? (
                <div className="flex justify-center items-center h-48">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
                    Scanning Neural Profile...
                  </span>
                </div>
              ) : modalProfile ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${modalProfile.name}`}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full bg-slate-800 border-2 border-white/10"
                    />
                    <div>
                      <h2 className="text-2xl font-black text-white">{modalProfile.name}</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {modalProfile.goal || "ACTIVE NODE"}
                      </p>
                    </div>
                  </div>

                  {modalProfile.trustScore !== undefined && modalProfile.trustScore !== null && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-400" />
                      <span className="text-xs font-black text-emerald-400 tracking-widest">
                        {modalProfile.trustScore.toFixed(1)} AI TRUST SCORE
                      </span>
                    </div>
                  )}

                  {modalMetrics ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-orange-400 mb-2">
                          <Flame size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
                        </div>
                        <p className="text-3xl font-black text-white">{modalMetrics.streak} <span className="text-sm text-slate-500">days</span></p>
                      </div>
                      
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-cyan-400 mb-2">
                          <LayoutGrid size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Nodes Fixed</span>
                        </div>
                        <p className="text-3xl font-black text-white">{modalMetrics.nodesFixed}</p>
                      </div>

                      <div className="col-span-2 space-y-3 mt-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capability Matrix</p>
                        {modalMetrics.capabilityMatrix?.map((matrixItem: any, i: number) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                              <span>{matrixItem.category}</span>
                              <span>{matrixItem.score}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  matrixItem.color === 'blue' ? 'bg-blue-500' :
                                  matrixItem.color === 'indigo' ? 'bg-indigo-500' : 'bg-cyan-500'
                                }`}
                                style={{ width: `${matrixItem.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-800/50 rounded-xl text-center text-slate-500 text-xs font-bold uppercase">
                      No advanced metrics found.
                    </div>
                  )}

                  <button
                   onClick={(e) => {
                     initiateUplink(modalProfile.id, e);
                     setSelectedUserId(null);
                   }}
                   className="w-full py-3 bg-blue-600 hover:bg-white hover:text-black transition-colors rounded-xl font-black text-sm uppercase tracking-widest text-white shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} /> Initiate Uplink
                  </button>
                </div>
              ) : (
                <div className="text-center text-red-400 p-4">Failed to load profile details.</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- END MODAL --- */}

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-current" />
              Real-time Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Learning <span className="text-blue-600">Sessions</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
              <input
                type="text"
                placeholder="Find a session..."
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-shadow shadow-sm"
              />
            </div>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-md shadow-blue-200 dark:shadow-none">
              + Schedule
            </button>
          </div>
        </header>

        {/* FAST TABS */}
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
          {["All", "Live", "Upcoming"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === t
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* GRID SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white`}
                  >
                    <Video className="w-5 h-5" />
                  </div>
                  {getStatus(session) === "Live" && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-black border border-red-100 dark:border-red-900/30">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>

                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {session.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {session.mentor}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {session.duration}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                      <Users className="w-3.5 h-3.5" /> {session.attendees}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleJoin(session.id)}
                  className={`mt-6 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    getStatus(session) === "Live"
                      ? "bg-slate-900 dark:bg-blue-600 text-white hover:opacity-90"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {getStatus(session) === "Live" ? "Join Now" : "Set Reminder"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* BOTTOM DOUBLE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LIST VIEW (Agenda) */}
          <section className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Weekly Agenda
              </h2>
              <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800 flex-1 overflow-y-auto max-h-[400px]">
              {sessions.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600`}
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {s.title}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {s.startTime} • {s.duration}
                      </p>
                    </div>
                  </div>
                  <CalendarIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </section>

          {/* CONNECTED NEURONS */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-blue-500 fill-blue-500" />
                Active Connections
              </h2>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800 flex-1 overflow-y-auto max-h-[400px]">
              {connections.length > 0 ? (
                connections.map((conn) => (
                  <div
                    key={conn.matchId}
                    onClick={() => openProfileModal(conn.matchedUser.id)}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conn.matchedUser.name}`}
                        className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform"
                        alt="Avatar"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {conn.matchedUser.name}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {Math.round(conn.score)}% SYNC
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => initiateUplink(conn.matchedUser.id, e)}
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-sm group-hover:shadow-md"
                      title="Initiate Uplink"
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-widest mb-2">No Active Links</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    Go matches to sync.
                  </span>
                </div>
              )}
            </div>

            {/* INCOMING REQUESTS (NEW SECTION) */}
            {pendingRequests.length > 0 && (
              <div className="bg-blue-600/5 border-t border-blue-500/10">
                <div className="px-6 py-4 bg-blue-600/10 border-b border-blue-500/10">
                  <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12} className="animate-pulse" />
                    Incoming Requests ({pendingRequests.length})
                  </h2>
                </div>
                <div className="divide-y divide-blue-500/10">
                  {pendingRequests.map((req) => (
                    <div key={req.matchId} className="flex items-center justify-between p-4 hover:bg-blue-600/10 transition-all">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.matchedUser.name}`}
                          className="w-8 h-8 rounded-full border border-blue-500/20 bg-slate-800"
                          alt="Avatar"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{req.matchedUser.name}</p>
                          <p className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">
                            Awaiting Authorization
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <button 
                           onClick={() => handleAcceptRequest(req.matchId)}
                           className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
                         >
                           Accept
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
