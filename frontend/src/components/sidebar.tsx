import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import { useChatContext } from "../context/ChatContext";
import { useSidebar } from "../context/SidebarContext";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "home" },
  { title: "Matches", icon: Heart, id: "matches" },
  { title: "Configuration", icon: BookOpen, id: "connect" },
  { title: "Sessions", icon: Calendar, id: "sessions" },
  { title: "Profile", icon: User, id: "me" },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const chatContext = useChatContext();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const totalUnreadCount = chatContext?.totalUnreadCount || 0;

  // Check authentication status
  const isLoggedIn = !!localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User Node";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isExpanded = !isCollapsed || isHovered;
  const activeTab = location.pathname.split("/")[1] || "home";

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{
          width: isExpanded ? 260 : 88,
          x: isMobileMenuOpen ? 0 : (window.innerWidth < 768 ? -300 : 0),
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          flex flex-col 
          h-screen md:h-[90vh] my-0 md:my-auto ml-0 md:ml-4
          bg-white/70 dark:bg-gray-900/60
          backdrop-blur-xl border-r md:border border-white/20 dark:border-gray-800/50 
          rounded-r-[2.5rem] md:rounded-[2.5rem] shadow-2xl z-[60] overflow-visible
          fixed md:relative
          top-0 left-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform duration-300 ease-in-out md:transition-none
        `}
      >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3 top-20 z-[60] h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition-transform"
      >
        {isCollapsed && !isHovered ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>

      {/* Branding */}
      <div
        className="flex items-center gap-4 px-6 mt-10 mb-12 h-10 overflow-hidden cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-black text-xl italic tracking-tighter">
            S
          </span>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-black tracking-tight text-gray-900 dark:text-white whitespace-nowrap"
            >
              SAAR<span className="text-blue-600">THI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
              onClick={() => navigate(`/${item.id}`)}
              className={`
                relative w-full flex items-center h-12 rounded-2xl transition-all group
                ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}
              `}
            >
              <AnimatePresence>
                {(hoveredTab === item.id || isActive) && (
                  <motion.span
                    layoutId="sidebar-pill"
                    className={`absolute inset-0 z-0 rounded-2xl ${isActive
                        ? "bg-blue-50/80 dark:bg-blue-900/20"
                        : "bg-gray-100/50 dark:bg-gray-800/30"
                      }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 flex items-center px-4 w-full">
                <div className="relative min-w-[24px] flex justify-center">
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.id === "sessions" && totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 z-[70]">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                        <span className="text-[8px] font-black text-white">{totalUnreadCount}</span>
                      </span>
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 16 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-sm font-bold whitespace-nowrap overflow-hidden"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800/50 overflow-hidden">
        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 pt-2">
              <button
                onClick={() => navigate("/me")}
                className="flex items-center w-full px-4 h-10 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="relative min-w-[32px] flex justify-center items-center shrink-0">
                   <img
                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                     className="w-6 h-6 rounded-full bg-slate-800 border border-white/10"
                     alt="Avatar"
                   />
                   <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#030508]"></div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 16 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex flex-col items-start text-left overflow-hidden py-1"
                    >
                      <span className="text-[11px] font-black leading-none truncate w-32 text-gray-900 dark:text-white text-left">
                        {userName}
                      </span>
                      <span className="text-[9px] font-bold opacity-50 mt-1 uppercase tracking-tighter text-left">
                        Neural Profile
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 h-10 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
              >
                <div className="relative min-w-[32px] flex justify-center items-center">
                  <LogOut size={20} />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 16 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-xs font-bold whitespace-nowrap overflow-hidden"
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center w-full h-12 px-4 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <div className="min-w-[24px] flex justify-center">
              <LogIn size={20} />
            </div>
            {isExpanded && (
              <span className="ml-4 text-sm font-black whitespace-nowrap tracking-tight">
                SIGN IN
              </span>
            )}
          </button>
        )}
      </div>
    </motion.aside>
    </>
  );
};

export default Sidebar;
