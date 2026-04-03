import React from "react";
import { Menu, Zap } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router";

export const MobileHeader: React.FC = () => {
  const { toggleMobileMenu } = useSidebar();
  const navigate = useNavigate();

  return (
    <header className="md:hidden sticky top-0 z-[50] w-full px-6 py-4 bg-[#030508]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center shadow-2xl">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Zap size={18} className="text-white fill-white" />
        </div>
        <span className="text-lg font-black tracking-tighter text-white italic uppercase">
          SAAR<span className="text-cyan-400">THI</span>
        </span>
      </div>

      <button
        onClick={toggleMobileMenu}
        className="p-2 text-slate-400 hover:text-white transition-colors"
      >
        <Menu size={24} />
      </button>
    </header>
  );
};
