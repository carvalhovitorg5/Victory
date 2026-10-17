import React from 'react';
import { Target, Sparkles, AlertTriangle, ShieldCheck, Trophy } from 'lucide-react';
import { FormationType, GameMode } from '../types/game';

interface GoalsMeterProps {
  totalGoals: number;
  targetGoals: number;
  draftedCount: number;
  totalPicks: number;
  legendaryCount: number;
  mode: GameMode;
  formation: FormationType;
  onChangeMode: (mode: GameMode) => void;
  onChangeFormation: (formation: FormationType) => void;
  canChangeSetup: boolean;
}

export const GoalsMeter: React.FC<GoalsMeterProps> = ({
  totalGoals,
  targetGoals,
  draftedCount,
  totalPicks,
  legendaryCount,
  mode,
  formation,
  onChangeMode,
  onChangeFormation,
  canChangeSetup,
}) => {
  const percentage = Math.min(100, Math.round((totalGoals / targetGoals) * 100));
  const difference = targetGoals - totalGoals;
  const isBusted = mode === 'LEGEND' && difference < 0;
  const isExactHit = totalGoals === targetGoals;

  // Tier calculation for classic mode
  const getClassicTier = () => {
    if (totalGoals >= 433) return { label: 'Campeão Brasileiro!', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-500/30' };
    if (totalGoals >= 380) return { label: 'Vice-Campeão (Libertadores)', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (totalGoals >= 300) return { label: 'Zona da Pré-Libertadores', color: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/30' };
    if (totalGoals >= 200) return { label: 'Copa Sul-Americana', color: 'text-indigo-300', bg: 'bg-indigo-500/10 border-indigo-500/30' };
    if (totalGoals >= 100) return { label: 'Meio de Tabela', color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-500/30' };
    return { label: 'Zona de Rebaixamento (Z-4)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const tier = getClassicTier();

  return (
    <div className="w-full bg-[#081b11] border border-emerald-800/60 rounded-xl p-4 sm:p-5 shadow-xl shadow-black/40">
      {/* Top Controls: Mode & Formation Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-emerald-900/60">
        {/* Game Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-lg border border-emerald-900/40">
          <button
            onClick={() => onChangeMode('CLASSIC')}
            disabled={!canChangeSetup && mode !== 'CLASSIC'}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
              mode === 'CLASSIC'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Modo Clássico (433+)
          </button>
          <button
            onClick={() => onChangeMode('LEGEND')}
            disabled={!canChangeSetup && mode !== 'LEGEND'}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              mode === 'LEGEND'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Modo Lenda (433 Exato)
          </button>
        </div>

        {/* Formation Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Formação:</span>
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-lg border border-emerald-900/40">
            {(['4-3-3', '4-4-2', '4-5-1', '3-5-2', '3-4-3'] as FormationType[]).map(form => (
              <button
                key={form}
                onClick={() => onChangeFormation(form)}
                disabled={!canChangeSetup && formation !== form}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded transition-all whitespace-nowrap cursor-pointer ${
                  formation === form
                    ? 'bg-yellow-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                } ${!canChangeSetup && formation !== form ? 'opacity-40 cursor-not-allowed' : ''}`}
                title={!canChangeSetup ? 'Finalize ou reinicie a partida para mudar o esquema tático' : undefined}
              >
                {form}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Scoreboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left: Total Goals vs Target */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight tabular-nums ${
              isExactHit
                ? 'text-yellow-400 animate-pulse'
                : isBusted
                ? 'text-rose-400'
                : 'text-white'
            }`}>
              {totalGoals}
            </div>
            <div className="text-xs text-emerald-400/80 font-medium uppercase tracking-wider flex items-center gap-1">
              Gols Marcados
            </div>
          </div>

          <div className="h-10 w-px bg-emerald-900/60" />

          <div>
            <div className="flex items-baseline gap-1 text-slate-400 text-xs font-medium">
              Alvo: <span className="text-lg font-black font-mono text-yellow-400">{targetGoals}</span> gols
            </div>
            <div className="text-xs text-slate-400">
              Escalação: <span className="font-mono text-white font-bold">{draftedCount}</span>/{totalPicks}
            </div>
          </div>
        </div>

        {/* Center: Dynamic Target Tracker / Status */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            {mode === 'CLASSIC' ? (
              <>
                <span className="text-slate-300 font-medium">Progresso da Meta</span>
                <span className="text-yellow-400 font-mono font-bold">{percentage}%</span>
              </>
            ) : (
              <>
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-yellow-400" />
                  Precisão 433 Exato
                </span>
                <span className={`font-mono font-bold ${
                  isExactHit
                    ? 'text-yellow-400'
                    : isBusted
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}>
                  {isExactHit
                    ? '433 CRAVADOS!'
                    : isBusted
                    ? `+${Math.abs(difference)} estourou`
                    : `Faltam ${difference} gols`}
                </span>
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-emerald-900/60 relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isExactHit
                  ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 animate-pulse'
                  : isBusted
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-emerald-500 via-green-400 to-yellow-400'
              }`}
              style={{ width: `${Math.min(100, (totalGoals / targetGoals) * 100)}%` }}
            />
          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            {mode === 'CLASSIC' ? (
              <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${tier.bg} ${tier.color}`}>
                Status: {tier.label}
              </span>
            ) : (
              <span className="text-amber-400/90 flex items-center gap-1">
                {isBusted ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    Cuidado: Ultrapassou a marca de 433!
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-yellow-400" />
                    Cada gol importa: mire exatamente 433!
                  </>
                )}
              </span>
            )}

            {difference > 0 && mode === 'CLASSIC' && (
              <span className="font-mono text-slate-400">
                Faltam {difference} gols
              </span>
            )}
          </div>
        </div>

        {/* Right: Legendary Badges & Tactical Indicator */}
        <div className="flex items-center justify-start md:justify-end gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-yellow-300/80 font-medium uppercase tracking-wider">
                Lendários no Time
              </span>
              <span className="text-base font-black font-mono text-yellow-400">
                {legendaryCount} <span className="text-xs font-normal text-yellow-200">/ 3+</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
