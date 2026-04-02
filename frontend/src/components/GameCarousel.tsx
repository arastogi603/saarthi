import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SudokuGame } from "./SudokuGame";
import { MemoryGame } from "./MemoryGame";
import { TicTacToeGame } from "./TicTacToeGame";

const games = [SudokuGame, MemoryGame, TicTacToeGame];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    };
  },
};

const swipeConfidenceThreshold = 5000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const GameCarousel: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  // We wrap the index around
  const gameIndex = ((page % games.length) + games.length) % games.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const CurrentGame = games[gameIndex];

  return (
    <div className="relative w-full h-[700px] lg:h-[600px] overflow-hidden rounded-[2.5rem]">
      {/* Navigation Arrows overlay */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-4 pointer-events-none">
        <button
          className="p-3 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-full text-slate-300 pointer-events-auto hover:bg-white/10 hover:text-white transition-all shadow-xl -ml-2"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="p-3 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-full text-slate-300 pointer-events-auto hover:bg-white/10 hover:text-white transition-all shadow-xl -mr-2"
          onClick={() => paginate(1)}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <CurrentGame />
        </motion.div>
      </AnimatePresence>
      
      {/* Indicator dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {games.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === gameIndex ? "w-8 bg-cyan-400" : "w-2 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
};
