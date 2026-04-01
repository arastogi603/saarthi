import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: ["React", "TypeScript"],
    skillLevel: "INTERMEDIATE",
    goal: "STUDY_BUDDY",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await api.post(endpoint, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userName", response.data.name);

      // Signal ChatContext to establish WebSocket connection immediately
      window.dispatchEvent(new CustomEvent("user-logged-in"));

      navigate("/connect");
    } catch (error: any) {
      setIsLoading(false);
      console.error("❌ BACKEND ERROR:", error.response?.data);
      setAuthError(error.response?.data?.message || "Authentication failed. Check your terminal.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F1A] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full" />

      {/* ... (rest of your Auth Form code remains the same) */}
      <motion.div className="relative z-10 w-full max-w-md p-8 mx-4 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl mb-4">
            <Sparkles className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            {isLogin ? "System Access" : "Create Node"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="password"
              placeholder="Secure Password"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          
          {authError && (
             <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-[10px] font-black uppercase text-center bg-red-400/10 py-2 rounded-xl border border-red-400/20"
             >
                {authError}
             </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 group transition-all disabled:opacity-50"
          >
            {isLoading
              ? "Authenticating..."
              : isLogin
                ? "Initialize Session"
                : "Deploy Profile"}
            {!isLoading && (
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Create new node" : "Existing node login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
