import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router"; 
import api from "../services/api";
import type { Message } from "../context/ChatContext";
import { useChatContext } from "../context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Hash,
  Circle,
  Users,
  Settings,
  ChevronLeft,
  Terminal,
  Zap,
  ShieldCheck,
  Video,
  Cpu,
} from "lucide-react";
import { MeetingRoom } from "../components/MeetingRoom";

interface Room {
  id: string;
  name: string;
  memberCount: number;
  lastActivity: string;
}

export const ChatPage: React.FC = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const { 
    messages: contextMessages, 
    addMessage, 
    setRoomMessages, 
    clearChatState, 
    isConnected, 
    rooms: contextRooms, 
    setActiveRoomId, 
    sendMessage,
    unreadCounts
  } = useChatContext();
  const [inputValue, setInputValue] = useState("");
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const handleStartMeet = () => {
    if (!activeRoom) return;
    setIsVideoActive(true);
    
    const payload = {
      roomId: Number(activeRoom.id),
      senderId: currentUserId,
      senderName: currentUserName,
      content: "[MEET_INVITE]",
      messageType: "CHAT"
    };

    const sent = sendMessage(activeRoom.id, payload);
    if (!sent) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: currentUserName,
      content: "[MEET_INVITE]",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "CHAT"
    };
    addMessage(activeRoom.id, newMessage);
  };

  const rooms: Room[] = useMemo(() => contextRooms.map((r: any) => ({
    id: r.id.toString(),
    name: r.name,
    memberCount: r.members?.length || 0,
    lastActivity: "Active"
  })), [contextRooms]);

  const messages = activeRoom ? (contextMessages[activeRoom.id] || []) : [];

  const currentUserId = Number(localStorage.getItem("userId") || 1);
  const currentUserName = localStorage.getItem("userName") || "Astra_Node";

  const scrollRef = useRef<HTMLDivElement>(null);


  // 1. Synchronize Active Room with roomId from URL and shared rooms state
  useEffect(() => {
    if (rooms.length === 0) return;

    if (!roomId) {
      navigate(`/chat/${rooms[0].id}`, { replace: true });
      return;
    }

    const target = rooms.find((r: any) => r.id === roomId);
    if (target) {
      setActiveRoom(target);
    } else {
      navigate(`/chat/${rooms[0].id}`, { replace: true });
    }
  }, [roomId, rooms.length, navigate]);

  // 2. Initial Message Fetch and set active room ID for global context
  useEffect(() => {
    if (!activeRoom) return;

    setActiveRoomId(activeRoom.id);

    // Fetch history
    const fetchHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const res = await api.get(`/api/chat/rooms/${activeRoom.id}/messages`);
        const mappedMsgs: Message[] = res.data.map((m: any) => ({
          id: `${m.sentAt}-${m.senderId}`,
          senderId: m.senderId === currentUserId ? "me" : m.senderId.toString(),
          senderName: m.senderName,
          content: m.content,
          timestamp: new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "CHAT"
        }));
        setRoomMessages(activeRoom.id, mappedMsgs);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    // Only fetch if we haven't loaded them this session
    if (!contextMessages[activeRoom.id]) {
      fetchHistory();
    }

    return () => {
      setActiveRoomId(null);
    };
  }, [activeRoom?.id, currentUserId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeRoom) return;

    const payload = {
      roomId: Number(activeRoom.id),
      senderId: currentUserId,
      senderName: currentUserName,
      content: inputValue,
      messageType: "CHAT"
    };

    const sent = sendMessage(activeRoom.id, payload);
    if (!sent) {
      console.warn("Message not sent — STOMP link not ready yet");
      return;
    }

    // Optimistic update (only after confirmed publish)
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: currentUserName,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "CHAT"
    };
    addMessage(activeRoom.id, newMessage);
    setInputValue("");
  };

  // Auto-scroll on new messages (single, deduplicated)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Wipe state on disconnect
  useEffect(() => {
    if (!isConnected) {
      clearChatState();
    }
  }, [isConnected]);

  return (
    <div key={activeRoom?.id || "empty"} className="h-screen bg-[#030508] text-slate-200 font-sans overflow-hidden flex flex-col relative">
      {/* --- BACKGROUND GLOW BEDS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/5 blur-[180px] rounded-full" />
      </div>

      {/* --- TOP NAV BAR --- */}
      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl z-20 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors lg:hidden"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Hash size={18} className="text-cyan-400" />
              <h1 className="font-black italic uppercase tracking-tighter text-xl">
                {activeRoom?.name || "No Cluster Active"}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Circle
                size={8}
                className={isConnected ? "fill-cyan-500 text-cyan-500 animate-pulse" : "fill-slate-600 text-slate-600"}
              />
              {isConnected ? `${activeRoom?.memberCount || 0} Nodes Active` : "Connecting Link..."}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={handleStartMeet} className="px-5 py-2.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-500/30 rounded-xl flex items-center gap-2 font-black tracking-widest text-[10px] uppercase transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <Video size={16} /> Init Video Uplink
          </button>
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#030508] bg-slate-800 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${i}`}
                  alt="user"
                />
              </div>
            ))}
          </div>
          <button className="p-2 hover:text-cyan-400 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden z-10 w-full relative">
        {/* --- LEFT SIDEBAR (Rooms/Channels) --- */}
        <aside className={`w-72 border-r border-white/5 bg-black/20 ${isVideoActive ? "hidden" : "hidden lg:flex"} flex-col p-6 gap-8 shrink-0`}>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">
              Neural Clusters
            </h3>
            <div className="space-y-2">
              {rooms.map((room: Room) => (
                <div
                  key={room.id}
                  onClick={() => navigate(`/chat/${room.id}`)}
                  className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${activeRoom?.id === room.id ? "bg-cyan-500/10 border border-cyan-500/20 text-white" : "hover:bg-white/5 text-slate-400"}`}
                >
                  <span className="font-bold italic uppercase tracking-tighter text-sm">
                    # {room.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadCounts[room.id] > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        {unreadCounts[room.id]}
                      </span>
                    )}
                    <Zap
                      size={14}
                      className={
                        activeRoom?.id === room.id
                          ? "text-cyan-400"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    />
                  </div>
                </div>
              ))}
              {rooms.length === 0 && <p className="text-[10px] italic opacity-50">Searching for clusters...</p>}
            </div>
          </div>

          <div className="mt-auto p-4 bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-black italic">
                AN
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase italic">
                  Astra_Node
                </span>
                <span className="text-[8px] text-cyan-400 uppercase tracking-widest font-bold">
                  Lvl 4 Admin
                </span>
              </div>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
            </div>
          </div>
        </aside>

        {/* --- VIDEO AREA --- */}
        {isVideoActive && (
          <section className="flex-1 relative bg-[#030508] border-r border-white/5 h-full z-20">
            <MeetingRoom roomName={activeRoom?.id || "lobby"} userName={currentUserName} onClose={() => setIsVideoActive(false)} />
          </section>
        )}

        {/* --- CHAT AREA --- */}
        {!isVideoActive && (
        <section className={`flex flex-col bg-white/[0.01] transition-all h-full z-10 flex-1`}>
          {/* Messages Wrapper */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
          >
            {isHistoryLoading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                  <Cpu size={64} className="mb-4 text-cyan-400" />
                </motion.div>
                <p className="font-black italic uppercase tracking-widest text-cyan-400">
                  Synchronizing Neural Link...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                <Terminal size={64} className="mb-4" />
                <p className="font-black italic uppercase tracking-widest">
                  Awaiting Data Input...
                </p>
              </div>
            ) : null}

            <AnimatePresence initial={false}>
              {!isHistoryLoading && messages.map((msg: Message) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] lg:max-w-[60%] flex flex-col ${msg.senderId === "me" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-2">
                      <span className="text-[10px] font-black uppercase text-cyan-500 italic">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold">
                        {msg.timestamp}
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-2xl ${
                        msg.senderId === "me"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-slate-900/80 border border-white/5 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.content === "[MEET_INVITE]" ? (
                        <div className="flex flex-col gap-3 items-center text-center p-2 min-w-[200px]">
                           <Video size={24} className="text-cyan-400 animate-pulse" />
                           <span className="text-[10px] uppercase font-black tracking-widest leading-relaxed">Neural Video Link<br />Established</span>
                           <button onClick={() => setIsVideoActive(true)} className="mt-1 w-full py-2.5 px-6 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-black text-xs uppercase transition-all active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                             Join Session
                           </button>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* --- INPUT COMPONENT --- */}
          <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-md">
            <form
              onSubmit={handleSendMessage}
              className="relative max-w-4xl mx-auto flex items-center gap-4"
            >
              <div className="absolute left-4 text-cyan-500/50">
                <Terminal size={18} />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Initialize message sequence..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-16 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600 font-medium italic"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 p-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all active:scale-90 shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="flex justify-center gap-6 mt-4 opacity-30 text-[8px] font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-1">
                <ShieldCheck size={10} /> End-to-End Encrypted
              </div>
              <div className="flex items-center gap-1">
                <Users size={10} /> Peer Node: Direct
              </div>
            </div>
          </div>
        </section>
        )}
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
