import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, Trophy } from "lucide-react";
import api from "../services/api";

// --- HELPERS (Daily Seeded Sudoku) ---
const generateDailySudoku = () => {
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const seed = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Basic pre-calculated board to start with
  const base = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  // Simple "Encryption" based on seed: shuffle rows within blocks, then shuffle blocks
  // For now, let's just rotate the numbers based on seed to ensure a different daily solve
  const shift = seed % 9;
  const puzzle = base.map(row => 
    row.map(val => ((val + shift - 1) % 9) + 1)
  );

  // Masking logic: Hide ~45 cells based on seed patterns
  const mask = puzzle.map((row, rIdx) => 
    row.map((val, cIdx) => {
      const pseudoRandom = Math.sin(seed + rIdx * 9 + cIdx) * 10000;
      const isVisible = (pseudoRandom - Math.floor(pseudoRandom)) > 0.55;
      return isVisible ? val : null;
    })
  );

  return { solution: puzzle, initial: mask };
};

export const SudokuGame: React.FC = () => {
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [initialMask, setInitialMask] = useState<(number | null)[][]>([]); // Track pre-filled cells
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isWinner, setIsWinner] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { solution, initial } = generateDailySudoku();
    setSolution(solution);
    setBoard(initial.map(row => [...row]));
    setInitialMask(initial.map(row => [...row]));
  }, []);

  const handleCellClick = (r: number, c: number) => {
    if (initialMask[r][c] === null) {
      setSelectedCell([r, c]);
      // Trigger focus to open mobile keyboard
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isWinner) return;
    const [r, c] = selectedCell;
    const newBoard = board.map((row, rIdx) => 
      row.map((val, cIdx) => (rIdx === r && cIdx === c ? num : val))
    );
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const checkWin = async (newBoard: (number | null)[][]) => {
    const isComplete = newBoard.every((row, r) => 
      row.every((val, c) => val === solution[r][c])
    );
    if (isComplete && !isWinner) {
      setIsWinner(true);
      if (!hasSynced) {
        try {
          await api.put("/api/users/me/sudoku-points?points=50");
          setHasSynced(true);
          // Global dispatch to refresh metrics on Dashboard
          window.dispatchEvent(new Event("neural-points-sync"));
        } catch (err) {
          console.error("Failed to sync neural points:", err);
        }
      }
    }
  };

  const resetGame = () => {
    const { initial } = generateDailySudoku();
    setBoard(initial.map(row => [...row]));
    setIsWinner(false);
    setSelectedCell(null);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isWinner) return;
    if (e.key >= "1" && e.key <= "9") handleNumberInput(Number(e.key));
    if (e.key === "Backspace" || e.key === "Delete") {
      handleBackspace();
    }
  };

  const handleBackspace = () => {
    if (selectedCell) {
      const [r, c] = selectedCell;
      const newBoard = board.map((row, rIdx) => 
        row.map((val, cIdx) => (rIdx === r && cIdx === c ? null : val))
      );
      setBoard(newBoard);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedCell, board, isWinner]);

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-4 lg:p-8 shadow-2xl overflow-hidden relative group h-full flex flex-col">
      {/* Background Pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700" />
      
      <div className="flex justify-between items-center mb-4 lg:mb-6 relative z-10">
        <input 
          ref={inputRef}
          type="text"
          inputMode="numeric"
          className="absolute -top-10 left-0 opacity-0 pointer-events-none"
          onChange={(e) => {
            const val = e.target.value.slice(-1);
            if (/[1-9]/.test(val)) {
              handleNumberInput(Number(val));
            }
            e.target.value = "";
          }}
        />
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg lg:text-xl font-black italic uppercase tracking-tighter text-white">Neural Sudoku</h3>
            <p className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase mt-0.5">Mission of the Day</p>
          </div>
          
          {!isWinner && (
            <div className="lg:hidden flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              <Zap size={12} className="text-cyan-400 fill-cyan-400" />
              <span className="text-[10px] font-black text-white">+50</span>
            </div>
          )}
        </div>

        <button 
           onClick={resetGame}
           className="p-2 lg:p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 items-center justify-center flex-1 overflow-hidden">
        {/* SUDOKU GRID */}
        <div className="grid grid-cols-9 gap-0.5 lg:gap-1 bg-slate-800/50 p-1.5 lg:p-2 rounded-xl lg:rounded-2xl border border-white/5 shadow-inner">
          {board.map((row, r) => 
            row.map((val, c) => {
              const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
              const isPreFilled = initialMask[r][c] !== null;
              const isBlockBorderR = (c + 1) % 3 === 0 && c < 8;
              const isBlockBorderB = (r + 1) % 3 === 0 && r < 8;

              return (
                <motion.div
                  key={`${r}-${c}`}
                  whileHover={!isPreFilled ? { scale: 1.05, zIndex: 10 } : {}}
                  onClick={() => handleCellClick(r, c)}
                  className={`
                    w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center text-xs lg:text-lg font-black cursor-pointer transition-all relative
                    ${isSelected ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] rounded-lg z-20" : "bg-slate-900 text-slate-100 rounded-md hover:bg-slate-800"}
                    ${isPreFilled ? "text-slate-500 cursor-default" : "italic text-cyan-400"}
                    ${isBlockBorderR ? "mr-1" : ""}
                    ${isBlockBorderB ? "mb-1" : ""}
                  `}
                >
                  {val || ""}
                  {isSelected && <div className="absolute inset-0 border-2 border-white rounded-lg animate-pulse" />}
                </motion.div>
              );
            })
          )}
        </div>

        {/* ACHIEVEMENTS & HINTS */}
        <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-48">
          <div className="p-3 lg:p-6 bg-slate-900 border border-white/5 rounded-2xl lg:rounded-3xl text-center space-y-2 lg:space-y-3 shadow-inner">
             <p className="text-[9px] lg:text-[10px] font-black text-cyan-500 uppercase tracking-widest leading-none">Neural Input</p>
             
             {/* Mobile Keypad */}
             <div className="grid grid-cols-3 gap-1.5 mt-1 lg:mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberInput(num)}
                    className="h-9 lg:h-12 bg-white/5 hover:bg-cyan-500/20 border border-white/10 rounded-lg lg:rounded-xl text-white font-black text-xs lg:text-base transition-all active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className="col-span-3 h-8 lg:h-12 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg lg:rounded-xl text-red-400 font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 mt-1"
                >
                  Clear Selection
                </button>
             </div>

             <div className="hidden lg:block pt-2">
               <p className="text-xs font-bold text-slate-400">Use keys <span className="text-white">1-9</span> to solve.</p>
               <p className="text-[10px] font-black text-slate-600 uppercase">Backspace to clear</p>
             </div>
          </div>

          <AnimatePresence>
            {isWinner && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/20 border border-emerald-500/30 p-3 lg:p-5 rounded-2xl lg:rounded-3xl text-center space-y-1 lg:space-y-2"
              >
                <div className="flex justify-center gap-2 text-emerald-400 mb-1">
                   {[1,2,3].map(i => <Trophy key={i} size={14} />)}
                </div>
                <h4 className="text-[11px] lg:text-sm font-black uppercase text-emerald-400 leading-none">Synthesis Complete</h4>
                <div className="flex items-center justify-center gap-2 text-[9px] font-black text-white uppercase tracking-widest">
                  <Zap size={10} className="text-cyan-400 fill-cyan-400" />
                  +50 Points Synced
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isWinner && (
             <div className="hidden lg:block p-5 bg-white/5 border border-white/5 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Reward</p>
                <div className="flex items-center justify-center gap-2 text-lg font-black text-white mt-1 italic">
                  50 <Zap size={18} className="text-cyan-400" />
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
