import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Users, BookOpen } from "lucide-react";

export const DetailedProgress: React.FC = () => {
  const milestones = [
    { id: 1, title: "Curriculum Design", status: "completed", time: "Mar 12" },
    {
      id: 2,
      title: "Interactive Quiz Setup",
      status: "completed",
      time: "Mar 20",
    },
    {
      id: 3,
      title: "Live Session - Module 1",
      status: "current",
      time: "In Progress",
    },
    { id: 4, title: "Final Certification", status: "upcoming", time: "Apr 05" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* 1. DETAILED MILESTONE STEPPER */}
      <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 italic">
          Course Roadmap
        </h3>
        <div className="space-y-10 relative">
          <div className="absolute left-[13px] top-2 bottom-2 w-[1px] bg-white/5" />

          {milestones.map((step, index) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              key={step.id}
              className="flex items-start gap-5 relative z-10"
            >
              {step.status === "completed" ? (
                <div className="bg-blue-500/20 rounded-xl p-1.5 border border-blue-500/30">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
              ) : step.status === "current" ? (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-1.5 animate-pulse">
                  <div className="w-3.5 h-3.5 bg-cyan-400 rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </div>
              ) : (
                <div className="bg-slate-900 border border-white/5 rounded-xl p-1.5">
                  <Circle className="w-3.5 h-3.5 text-slate-800" />
                </div>
              )}

              <div>
                <p className={`text-sm font-black italic tracking-tight ${step.status === "upcoming" ? "text-slate-600" : "text-slate-200"}`}>
                  {step.title}
                </p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  {step.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. CATEGORY BREAKDOWN */}
      <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic">
              Performance Details
            </h3>
            <p className="text-3xl font-black text-white italic tracking-tighter uppercase">
              Advanced UI Batch
            </p>
          </div>
          <div className="flex gap-6">
            <StatMini
              icon={Users}
              label="Nodes"
              value="84"
              color="text-blue-400"
            />
            <StatMini
              icon={Clock}
              label="Uptime"
              value="12.5h"
              color="text-cyan-400"
            />
          </div>
        </div>

        {/* Segmented Progress Bars */}
        <div className="space-y-8 flex-1">
          <DetailBar
            label="Content Completion"
            percentage={85}
            color="bg-blue-500"
          />
          <DetailBar
            label="Neural Satisfaction"
            percentage={92}
            color="bg-cyan-400"
          />
          <DetailBar
            label="Sync Returns"
            percentage={64}
            color="bg-indigo-500"
          />
        </div>

        {/* Micro Summary Card */}
        <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-5 group">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl group-hover:bg-cyan-500/20 transition-all">
            <BookOpen className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em]">
              Current Focus
            </p>
            <p className="text-sm text-slate-300 font-bold italic mt-0.5">
              Data Architecture & Neural Logic Synthesis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatMini = ({ icon: Icon, label, value, color }: any) => (
  <div className="text-right">
    <div className="flex items-center justify-end gap-1.5 mb-1.5">
      <Icon className={`w-3 h-3 ${color}`} />
      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
        {label}
      </span>
    </div>
    <p className="text-2xl font-black text-white italic leading-none tracking-tighter">{value}</p>
  </div>
);

const DetailBar = ({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) => (
  <div className="w-full">
    <div className="flex justify-between mb-3 items-end">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{label}</span>
      <span className="text-xs font-black text-white italic tracking-tighter">{percentage}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-[1px]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full ${color} rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]`}
      />
    </div>
  </div>
);
