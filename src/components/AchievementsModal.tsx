import React from 'react';
import { X, Award, CheckCircle2, Lock, Sparkles, Trophy, Flame, Shield, Target, Crown, ShieldAlert } from 'lucide-react';
import { Achievement } from '../types/game';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-cyan-400" />;
      case 'Target': return <Target className="w-5 h-5 text-rose-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-yellow-300" />;
      default: return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#081f13] via-[#05160d] to-[#020b06] border border-emerald-700/60 p-5 sm:p-7 shadow-2xl text-white relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Galeria de Conquistas
            </h2>
            <p className="text-xs text-emerald-400/90 font-medium">
              Desbloqueie troféus e marcas históricas do Brasileirão
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 rounded-xl bg-black/40 border border-emerald-900/60 mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-medium">Progresso de Conquistas</span>
            <span className="font-mono font-bold text-yellow-400">
              {unlockedCount} de {achievements.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-emerald-950">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-[#123320] to-[#091f13] border-emerald-600/60 text-white shadow-sm'
                  : 'bg-black/30 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                  ach.unlocked
                    ? 'bg-yellow-400/10 border-yellow-500/40 text-yellow-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {ach.unlocked ? getIcon(ach.iconName) : <Lock className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={`text-sm font-bold truncate ${
                      ach.unlocked ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {ach.title}
                  </h4>
                  {ach.unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {ach.description}
                </p>

                {ach.unlocked && ach.unlockedAt && (
                  <div className="text-[10px] text-emerald-400/80 font-mono mt-1">
                    Desbloqueado em {ach.unlockedAt}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
