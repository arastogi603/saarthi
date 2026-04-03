import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import {
  Sparkles,
  Layers,
  Search,
  Check,
  Plus,
} from "lucide-react";
import { SkillSelector } from "../components/SkillSelector";

import { useNavigate } from "react-router";

type AppState = "idle"; // Simplify state to only idle form



export const SaarthiBuddyEngine: React.FC = () => {
  const [step] = useState<AppState>("idle");
    const [objective, setObjective] = useState<string>("STUDY_BUDDY");
  const [studyMode, setStudyMode] = useState<string>("LEARN_TOGETHER");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [teamSize, setTeamSize] = useState<number>(2);
  const [requiredTeamSkills, setRequiredTeamSkills] = useState<string[]>([]);
  const navigate = useNavigate();

  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "Node.js",
    "AI/ML",
    "Next.js",
    "Tailwind",
  ]);

  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const objectives = [
    { id: "STUDY_BUDDY", label: "Study Buddy", desc: "Learn together" },
    { id: "PROJECT_PARTNER", label: "Project Making", desc: "Build a product" },
    { id: "HACKATHON", label: "Hackathon Team", desc: "Compete & Win" },
  ];

  const studyModes = [
    { id: "TEACH", label: "I want to teach", desc: "Share your expertise" },
    { id: "LEARN_TOGETHER", label: "Learn together", desc: "Mutual growth" },
    { id: "ASK_QUESTIONS", label: "Want to ask questions", desc: "Get help from a mentor" },
  ];

  const saveProfile = async () => {
    const profileUpdate = {
      name: localStorage.getItem("userName") || "Developer",
      bio: `Looking for a ${objective}${objective === "STUDY_BUDDY" ? ` (${studyMode})` : ""}`,
      goal: objective,
      studyMode: objective === "STUDY_BUDDY" ? studyMode : null,
      // Removed skills update - users manage skills via profile tab
    };

    await api.put("/api/users/me", profileUpdate);

    // If it's a project or hackathon, create/update the project record
    if (objective === "PROJECT_PARTNER" || objective === "HACKATHON") {
      const projectData = {
        title: `${objective === "HACKATHON" ? "Hackathon" : "Project"}: ${localStorage.getItem("userName")}'s Team`,
        description: `Team formation for ${objective}. Seeking members with specific skills.`,
        requiredSkills: requiredTeamSkills,
        maxMembers: teamSize,
        status: "OPEN"
      };
      await api.post("/api/projects", projectData);
    }
  };

  const handleSaveOnly = async () => {
    if (selectedSkills.length === 0) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
      return;
    }
    try {
      await saveProfile();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Neural Config Failure:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleStartMatching = async () => {
    if (selectedSkills.length === 0) return;
    try {
      await saveProfile();
      navigate("/matches", { state: { activeObjective: objective } });
    } catch (error) {
      console.error("Neural sync error:", error);
    }
  };

  const handleAddSkill = (skillName: string) => {
    if (!skills.includes(skillName)) {
      setSkills(prev => [...prev, skillName]);
    }
    if (!selectedSkills.includes(skillName)) {
      setSelectedSkills(prev => [...prev, skillName]);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const toggleTeamSkill = (skill: string) => {
    setRequiredTeamSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  /* Redundant localized matching UI removed for global router shift */

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />

      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="w-full max-w-xl bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl z-10"
          >
            <div className="space-y-2 mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} /> AI Matchmaker
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                Find Your <span className="text-blue-500">Niche.</span>
              </h1>
            </div>

            <div className="space-y-8">
              {/* 01. MISSION PURPOSE (MOVED UP) */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Layers size={14} className="text-blue-500" /> 01. Mission
                  Purpose
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {objectives.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => setObjective(obj.id)}
                      className={`px-6 py-3 rounded-2xl border flex items-center justify-between transition-all group ${
                        objective === obj.id
                          ? "bg-blue-600/20 border-blue-500 text-white"
                          : "bg-slate-800/30 border-slate-700 text-slate-500"
                      }`}
                    >
                      <div className="text-left">
                        <p
                          className={`text-[10px] font-black uppercase ${objective === obj.id ? "text-blue-400" : "text-slate-400"}`}
                        >
                          {obj.label}
                        </p>
                        <p className="text-[9px] opacity-60 font-bold">
                          {obj.desc}
                        </p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full transition-all ${objective === obj.id ? "bg-blue-500 scale-125" : "bg-slate-700"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 02. STUDY MODE / TEAM CONFIG (CONDITIONAL) */}
              {objective === "STUDY_BUDDY" ? (
                 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      <Sparkles size={14} className="text-blue-500" /> 02. Study Interaction Mode
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {studyModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setStudyMode(mode.id)}
                          className={`px-6 py-3 rounded-2xl border flex items-center justify-between transition-all ${
                            studyMode === mode.id
                              ? "bg-indigo-600/20 border-indigo-500 text-white"
                              : "bg-slate-800/30 border-slate-700 text-slate-500"
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase">{mode.label}</p>
                            <p className="text-[9px] opacity-60 font-bold">{mode.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                 </div>
              ) : (
                <div className="space-y-6 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      <Plus size={14} className="text-blue-500" /> 02. Team Size Needed
                    </label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="2" 
                        max="10" 
                        value={teamSize} 
                        onChange={(e) => setTeamSize(parseInt(e.target.value))}
                        className="flex-1 accent-blue-500 bg-slate-800 rounded-lg h-1.5"
                      />
                      <span className="text-xl font-black text-white w-8">{teamSize}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 03. SKILLS SECTION (REFACTORED) */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Search size={14} className="text-blue-500" /> 
                  {objective === "STUDY_BUDDY" ? "03. Topic Focus" : "03. Skills Required from Others"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <button
                      key={s}
                      onClick={() => objective === "STUDY_BUDDY" ? toggleSkill(s) : toggleTeamSkill(s)}
                      className={`px-4 py-2 rounded-2xl text-[10px] font-bold border transition-all ${
                        (objective === "STUDY_BUDDY" ? selectedSkills.includes(s) : requiredTeamSkills.includes(s))
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-slate-800/50 border-slate-700 text-slate-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsAddingSkill(true)}
                    className="px-4 py-2 rounded-2xl text-[10px] font-black border border-dashed border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition-all flex items-center gap-2"
                  >
                    <Plus size={14} /> ADD
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={handleSaveOnly}
                className={`w-1/3 py-5 border rounded-[2rem] font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
                  saveStatus === "saved" 
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" 
                    : saveStatus === "error"
                    ? "bg-red-500/20 border-red-500 text-red-500"
                    : "bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-white"
                }`}
              >
                {saveStatus === "saved" ? (
                  <>
                    SAVED <Check size={14} />
                  </>
                ) : saveStatus === "error" ? (
                  "ERROR"
                ) : (
                  "SAVE DETAILS"
                )}
              </button>
              <button
                onClick={handleStartMatching}
                className="w-2/3 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
              >
                <Search size={18} /> INITIATE MATCHING
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {isAddingSkill && (
          <SkillSelector 
            onSelect={(skill) => handleAddSkill(skill)}
            onClose={() => setIsAddingSkill(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
