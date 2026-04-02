import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, Trophy, Brain } from "lucide-react";
import api from "../services/api";

// Icons for the memory cards
const ICONS = ["⚛️", "🚀", "🪐", "🧠", "⚡", "코드", "🔥", "🔮"];

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setIsWinner(false);
    setHasSynced(false);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlippedCards;

      if (newCards[firstIndex].content === newCards[secondIndex].content) {
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
        setIsLocked(false);
        checkWin(newCards);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const checkWin = async (currentCards: Card[]) => {
    const isComplete = currentCards.every((card) => card.isMatched);
    if (isComplete && !isWinner) {
      setIsWinner(true);
      if (!hasSynced) {
        try {
          // You could use a different amount or endpoint for this game
          await api.put("/api/users/me/sudoku-points?points=25");
          setHasSynced(true);
          window.dispatchEvent(new Event("neural-points-sync"));
        } catch (err) {
          console.error("Failed to sync neural points:", err);
        }
      }
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl overflow-hidden relative group h-full flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Neural Match</h3>
          <p className="text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase mt-0.5">Pattern Recognition</p>
        </div>
        <button 
           onClick={initializeGame}
           className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20 relative"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center flex-1">
        {/* GRID */}
        <div className="grid grid-cols-4 gap-2 bg-slate-800/50 p-3 rounded-3xl border border-white/5 shadow-inner">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
              whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
              className={`
                w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center text-2xl lg:text-3xl font-black cursor-pointer rounded-2xl transition-all duration-300
                ${card.isFlipped || card.isMatched 
                  ? "bg-purple-500/20 border border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
                  : "bg-slate-900 border border-white/10 text-transparent hover:bg-slate-800"}
              `}
            >
              <AnimatePresence>
                {(card.isFlipped || card.isMatched) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.content}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* ACHIEVEMENTS & HINTS */}
        <div className="flex flex-col gap-6 w-full lg:w-48">
          <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl text-center space-y-3 shadow-inner">
             <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Neural Input</p>
             <p className="text-xs font-bold text-slate-400">Flip cells to find <span className="text-white">matching</span> pairs.</p>
             <Brain size={24} className="mx-auto text-purple-500/50 mt-2" />
          </div>

          <AnimatePresence>
            {isWinner && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/20 border border-emerald-500/30 p-5 rounded-3xl text-center space-y-2"
              >
                <div className="flex justify-center gap-2 text-emerald-400 mb-1">
                   {[1,2,3].map(i => <Trophy key={i} size={16} />)}
                </div>
                <h4 className="text-sm font-black uppercase text-emerald-400">Synthesis Complete</h4>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
                  <Zap size={12} className="text-purple-400 fill-purple-400" />
                  +25 Points Synced
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isWinner && (
             <div className="p-5 bg-white/5 border border-white/5 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Reward</p>
                <div className="flex items-center justify-center gap-2 text-lg font-black text-white mt-1 italic">
                  25 <Zap size={18} className="text-purple-400" />
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
