import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, Trophy, Target } from "lucide-react";
import api from "../services/api";

type Player = "X" | "O" | null;

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true); // User is always X to start
  const [winner, setWinner] = useState<Player | "Draw">(null);
  const [hasSynced, setHasSynced] = useState(false);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) {
      return "Draw";
    }
    return null;
  };

  const handleAIMove = (currentBoard: Player[]) => {
    const emptyIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null) as number[];

    if (emptyIndices.length === 0) return;

    // Pick random empty spot
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = "O";
    
    setBoard(newBoard);
    setIsXNext(true);

    const matchWinner = checkWinner(newBoard);
    if (matchWinner) {
      setWinner(matchWinner);
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXNext(false);

    const matchWinner = checkWinner(newBoard);
    if (matchWinner) {
      setWinner(matchWinner);
    } else {
      setTimeout(() => {
        handleAIMove(newBoard);
      }, 500);
    }
  };

  useEffect(() => {
    const syncPoints = async () => {
      if (winner === "X" && !hasSynced) {
        try {
          await api.put("/api/users/me/sudoku-points?points=10");
          setHasSynced(true);
          window.dispatchEvent(new Event("neural-points-sync"));
        } catch (err) {
          console.error("Failed to sync neural points:", err);
        }
      }
    };
    syncPoints();
  }, [winner, hasSynced]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setHasSynced(false);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl overflow-hidden relative group h-full flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[80px] rounded-full group-hover:bg-pink-500/20 transition-all duration-700" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Neural Grid</h3>
          <p className="text-[10px] font-black tracking-[0.2em] text-pink-400 uppercase mt-0.5">Tactical Module</p>
        </div>
        <button 
           onClick={resetGame}
           className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20 relative"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center flex-1">
        {/* TIC TAC TOE GRID */}
        <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-3 rounded-3xl border border-white/5 shadow-inner w-full max-w-[240px] lg:max-w-[300px]">
          {board.map((cell, idx) => (
            <motion.div
              key={idx}
              whileHover={!cell && !winner && isXNext ? { scale: 1.05 } : {}}
              whileTap={!cell && !winner && isXNext ? { scale: 0.95 } : {}}
              onClick={() => handleClick(idx)}
              className={`
                aspect-square flex items-center justify-center text-4xl lg:text-5xl font-black cursor-pointer rounded-2xl transition-all duration-300 relative
                ${cell === "X" ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : ""}
                ${cell === "O" ? "text-pink-400 bg-pink-500/10 border-pink-500/30 shadow-[0_0_15px_rgba(2ec4b6,0.2)]" : ""}
                ${!cell ? "bg-slate-900 border border-white/10 hover:bg-slate-800" : "border"}
              `}
            >
              <AnimatePresence>
                {cell && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* ACHIEVEMENTS & HINTS */}
        <div className="flex flex-col gap-6 w-full lg:w-48">
          <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl text-center space-y-3 shadow-inner">
             <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Neural Input</p>
             <p className="text-xs font-bold text-slate-400">Outsmart the <span className="text-white">AI</span> to claim victory.</p>
             <Target size={24} className="mx-auto text-pink-500/50 mt-2" />
          </div>

          <AnimatePresence>
            {winner === "X" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/20 border border-emerald-500/30 p-5 rounded-3xl text-center space-y-2"
              >
                <div className="flex justify-center gap-2 text-emerald-400 mb-1">
                   {[1,2,3].map(i => <Trophy key={i} size={16} />)}
                </div>
                <h4 className="text-sm font-black uppercase text-emerald-400">Victory!</h4>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
                  <Zap size={12} className="text-cyan-400 fill-cyan-400" />
                  +10 Points Synced
                </div>
              </motion.div>
            )}
            {winner === "O" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 p-5 rounded-3xl text-center space-y-2"
              >
                <h4 className="text-sm font-black uppercase text-red-400">Defeat</h4>
                <p className="text-[10px] text-slate-400">AI overrides system.</p>
              </motion.div>
            )}
            {winner === "Draw" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-500/20 border border-slate-500/30 p-5 rounded-3xl text-center space-y-2"
              >
                <h4 className="text-sm font-black uppercase text-slate-300">Stalemate</h4>
                <p className="text-[10px] text-slate-400">No dominant node.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!winner && (
             <div className="p-5 bg-white/5 border border-white/5 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Reward</p>
                <div className="flex items-center justify-center gap-2 text-lg font-black text-white mt-1 italic">
                  10 <Zap size={18} className="text-pink-400" />
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
