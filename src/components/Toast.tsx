import React, { useEffect } from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { Achievement } from '../types/game';

interface ToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-gradient-to-r from-[#173a25] to-[#0d2617] border-2 border-yellow-400 text-white p-4 rounded-2xl shadow-2xl shadow-yellow-500/20 flex items-start gap-3 animate-in slide-in-from-bottom-5">
      <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md">
        <Sparkles className="w-5 h-5 fill-slate-950" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-yellow-300">
          🏆 Nova Conquista Desbloqueada!
        </div>
        <h4 className="text-sm font-black text-white truncate">
          {achievement.title}
        </h4>
        <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
          {achievement.description}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-black/30 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
