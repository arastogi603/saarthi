import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage, IFrame } from "@stomp/stompjs";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "CHAT" | "JOIN" | "LEAVE";
}

interface ChatContextProps {
  stompClient: Client | null;
  isConnected: boolean;
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;
  unreadCounts: Record<string, number>;
  totalUnreadCount: number;
  clearUnreadCount: (roomId: string) => void;
  messages: Record<string, Message[]>;
  addMessage: (roomId: string, message: Message) => void;
  setRoomMessages: (roomId: string, messages: Message[]) => void;
  refreshRooms: () => void;
  rooms: any[];
  // Stable send helper — always reads from ref, never stale React state
  sendMessage: (roomId: string, payload: object) => boolean;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeRoomId, setActiveRoomIdState] = useState<string | null>(null);
  const activeRoomIdRef = useRef<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [rooms, setRooms] = useState<any[]>([]);
  
  const isConnectingRef = useRef(false);
  const subscriptionsMapRef = useRef<Record<string, any>>({});
  const [toasts, setToasts] = useState<{ id: string; title: string; message: string; roomId: string }[]>([]);

  // Read userId dynamically so we always get the latest value from localStorage
  const getCurrentUserId = () => Number(localStorage.getItem("userId"));
  const totalUnreadCount = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  const setActiveRoomId = (id: string | null) => {
    setActiveRoomIdState(id);
    activeRoomIdRef.current = id;
    if (id) clearUnreadCount(id);
  };

  const clearUnreadCount = (roomId: string) => {
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[roomId];
      return next;
    });
  };

  const addMessage = (roomId: string, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), message]
    }));
  };

  const setRoomMessages = (roomId: string, newMessages: Message[]) => {
    setMessages((prev) => ({
      ...prev,
      [roomId]: newMessages
    }));
  };

  const showToast = (title: string, message: string, roomId: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, roomId }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reusable subscription logic per room
  const subscribeToRoom = (client: Client, room: any) => {
    const roomId = room.id.toString();
    if (subscriptionsMapRef.current[roomId]) return;

    console.log(`📡 Neural Uplink to Room: ${room.name} (${roomId})`);
    const sub = client.subscribe(`/topic/room/${roomId}`, (msg: IMessage) => {
      const body = JSON.parse(msg.body);
      if (Number(body.senderId) !== Number(getCurrentUserId())) {
        const incoming: Message = {
          id: body.sentAt || Date.now().toString(),
          senderId: body.senderId.toString(),
          senderName: body.senderName,
          content: body.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "CHAT"
        };
        addMessage(roomId, incoming);
        if (activeRoomIdRef.current !== roomId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [roomId]: (prev[roomId] || 0) + 1
          }));
          showToast(`#${room.name}`, `${body.senderName}: ${body.content}`, roomId);
        }
      }
    });
    subscriptionsMapRef.current[roomId] = sub;
  };

  // HOT SYNC: Fetches rooms and adds new subscriptions without restart
  const syncSubscriptions = async (client: Client) => {
     try {
        const res = await api.get("/api/chat/rooms");
        const roomsData = res.data;
        setRooms(roomsData);
        roomsData.forEach((r: any) => subscribeToRoom(client, r));
     } catch (err) {
        console.error("Hot-Sync Failure:", err);
     }
  };

  const refreshRooms = async () => {
     const userId = getCurrentUserId();
     if (!userId || isConnectingRef.current) return;

     // If already active, just hot-sync new rooms
     if (stompClientRef.current?.active) {
        console.log("Hot-Sync Activated: Fetching new clusters...");
        await syncSubscriptions(stompClientRef.current);
        return;
     }
     
     isConnectingRef.current = true;
     console.log("Initializing Neural Link...");

     try {
        const socketUrl = api.defaults.baseURL ? `${api.defaults.baseURL}/ws` : "http://localhost:8080/ws";
        const socket = new SockJS(socketUrl);
        const client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          onConnect: async () => {
            console.log("Global Neural Link Established");
            setIsConnected(true);
            isConnectingRef.current = false;
            
            // Initial sync on connect
            await syncSubscriptions(client);

            // 2. SUBSCRIBE TO USER-SPECIFIC NOTIFICATION QUEUE
            client.subscribe("/user/queue/notifications", (msg: IMessage) => {
              const signal = JSON.parse(msg.body);
              console.log("Neural Signal Received:", signal);
              
              if (signal.type === "HANDSHAKE_COMPLETE") {
                 console.log("Handshake Complete Signal: Immediate Refresh Triggered.");
                 // Use hot-sync instead of full refresh loop
                 syncSubscriptions(client);
                 showToast("Neural Link Established", `You are now synced with ${signal.peerName}`, "/sessions");
                 window.dispatchEvent(new CustomEvent("neural-sync", { detail: signal }));
              }
            });
          },
          onDisconnect: () => {
            setIsConnected(false);
            isConnectingRef.current = false;
            subscriptionsMapRef.current = {};
          },
          onStompError: (_frame: IFrame) => {
            setIsConnected(false);
            isConnectingRef.current = false;
          }
        });

        client.activate();
        stompClientRef.current = client;
        setStompClient(client);

     } catch (err) {
        console.error("Neural Connection Failure", err);
        isConnectingRef.current = false;
     }
  };

  useEffect(() => {
    // Attempt initial connection (may be a no-op if not logged in yet)
    refreshRooms();

    // Listen for when login writes userId to localStorage (cross-tab or same-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "userId" && e.newValue && !stompClientRef.current?.active) {
        console.log("🔑 UserId detected in storage — initiating Neural Link...");
        refreshRooms();
      }
    };

    // Custom event dispatched by AuthPage immediately after login
    const handleUserLogin = () => {
      if (!stompClientRef.current?.active) {
        console.log("🔑 User login event — initiating Neural Link...");
        refreshRooms();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("user-logged-in", handleUserLogin);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("user-logged-in", handleUserLogin);
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        subscriptionsMapRef.current = {};
        isConnectingRef.current = false;
      }
    };
  }, []);

  // Use ref directly — avoids stale closure / state lag that blocks sending
  const sendMessage = (roomId: string, payload: object): boolean => {
    const client = stompClientRef.current;
    if (!client || !client.active) {
      console.warn("sendMessage: STOMP client not active yet", { roomId, clientExists: !!client, active: client?.active });
      return false;
    }
    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(payload),
    });
    return true;
  };

  const value = {
    stompClient,
    isConnected,
    activeRoomId,
    setActiveRoomId,
    unreadCounts,
    totalUnreadCount,
    clearUnreadCount,
    messages,
    addMessage,
    setRoomMessages,
    refreshRooms,
    rooms,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.8 }}
              layout
              className="pointer-events-auto w-full bg-slate-900/90 backdrop-blur-2xl border border-blue-500/30 shadow-[0_20px_50px_rgba(37,99,235,0.2)] rounded-[2rem] p-5 flex gap-4 overflow-hidden group cursor-pointer relative"
              onClick={() => {
                removeToast(toast.id);
                navigate(toast.roomId.startsWith("/") ? toast.roomId : `/chat/${toast.roomId}`);
              }}
            >
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 w-full" />
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20 text-blue-400">
                {toast.title.includes("Link") ? <Zap size={22} className="animate-pulse" /> : <MessageSquare size={22} />}
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-[10px] font-black uppercase italic tracking-[0.2em] text-blue-400">{toast.title}</h4>
                <p className="text-sm font-bold text-slate-200 truncate mt-1">{toast.message}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Click to establish uplink</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                className="absolute top-4 right-4 p-1 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ChatContext.Provider>
  );
};
