import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  Plus, 
  Code2, 
  Terminal, 
  Database, 
  Cpu, 
  Layout, 
  Server, 
  Palette, 
  Coffee,
  FileJson,
  FlaskConical,
  Globe,
  Settings2
} from "lucide-react";

interface SkillOption {
  name: string;
  icon: React.ElementType;
  color: string;
}

const PREDEFINED_SKILLS: SkillOption[] = [
  { name: "React", icon: Layout, color: "text-cyan-400" },
  { name: "TypeScript", icon: Code2, color: "text-blue-400" },
  { name: "Node.js", icon: Server, color: "text-green-400" },
  { name: "Python", icon: Terminal, color: "text-yellow-400" },
  { name: "Java", icon: Coffee, color: "text-orange-400" },
  { name: "AI/ML", icon: Cpu, color: "text-purple-400" },
  { name: "Next.js", icon: Globe, color: "text-white" },
  { name: "Tailwind", icon: Palette, color: "text-sky-400" },
  { name: "SQL", icon: Database, color: "text-indigo-400" },
  { name: "JSON", icon: FileJson, color: "text-amber-400" },
  { name: "Testing", icon: FlaskConical, color: "text-rose-400" },
];

interface SkillSelectorProps {
  onSelect: (skill: string, level: string) => void;
  onClose: () => void;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({ onSelect, onClose }) => {
  const [customSkill, setCustomSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Mid");

  const handleSelect = (skillName: string) => {
    onSelect(skillName, selectedLevel);
    onClose();
  };

  const handleAddCustom = () => {
    if (customSkill.trim()) {
      handleSelect(customSkill.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[80px] rounded-full" />
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Select Capability</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Level Selection */}
        <div className="mb-8 space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency Level</label>
          <div className="grid grid-cols-3 gap-2">
            {["Beginner", "Mid", "Pro"].map((lv) => (
              <button
                key={lv}
                onClick={() => setSelectedLevel(lv)}
                className={`py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${
                  selectedLevel === lv
                    ? "bg-blue-600 border-blue-400 text-white"
                    : "bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500"
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>

        {/* Predefined Grid */}
        <div className="mb-8 space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Popular Nodes</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
            {PREDEFINED_SKILLS.map((skill) => (
              <button
                key={skill.name}
                onClick={() => handleSelect(skill.name)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
              >
                <skill.icon size={20} className={`${skill.color} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="text-[9px] font-bold text-slate-300 uppercase truncate w-full text-center">{skill.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Skill */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Custom Protocol</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Settings2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Enter custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-bold"
              />
            </div>
            <button
              onClick={handleAddCustom}
              disabled={!customSkill.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
};
