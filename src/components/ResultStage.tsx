import React from 'react';
import { RotateCcw, Share2, Check, Trophy, Sparkles } from 'lucide-react';
import { GameMode } from '../types/game';
import { getFootballJargon } from '../utils/jargon';

interface ResultStageProps {
  totalGoals: number;
  targetGoals: number;
  mode: GameMode;
  onRestart: () => void;
  onShare: () => void;
  isCopied: boolean;
  onOpenRankings?: () => void;
}

export const ResultStage: React.FC<ResultStageProps> = ({
  totalGoals,
  targetGoals,
  mode,
  onRestart,
  onShare,
  isCopied,
  onOpenRankings,
}) => {
  const isClassicWon = mode === 'CLASSIC' && totalGoals >= targetGoals;
  const isLegendWon = mode === 'LEGEND' && totalGoals === targetGoals;
  const isWon = mode === 'CLASSIC' ? isClassicWon : isLegendWon;

  const difference = totalGoals - targetGoals;
  const jargon = getFootballJargon(totalGoals, targetGoals, mode);

  return (
    <div className="w-full bg-[#f6f5ef] dark:bg-[#121f18] border border-[#d8d5cb] dark:border-[#263c30] rounded-xl overflow-hidden shadow-xs flex flex-col min-h-[460px] transition-colors">
      {/* Top Bar of Left Stage */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#dedbd2] dark:border-[#22362a] text-xs font-bold uppercase tracking-wider text-[#6a7c72] dark:text-[#8ea598]">
        <span>APITO FINAL</span>
        <span>
          RODADA <strong className="text-[#cb6d53] font-mono">11</strong> / 11
        </span>
      </div>

      {/* Main Center Victory / Summary Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center">
        {/* Kicker */}
        <div className="text-xs uppercase font-bold tracking-widest text-[#6c7d74] dark:text-[#8ea598] mb-3 flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#cb6d53]" />
          <span>{isWon ? 'MISSÃO CUMPRIDA' : 'FIM DE JOGO'}</span>
        </div>

        {/* Huge Gols Score Display */}
        <div className="font-display font-black text-6xl sm:text-8xl tracking-tight leading-none tabular-nums text-[#385345] dark:text-[#8ec4a2] flex items-baseline justify-center">
          <span>{totalGoals}</span>
          <span className="text-4xl sm:text-5xl text-[#a2b5ab] dark:text-[#52705e] font-bold ml-2">
            / {targetGoals}
          </span>
        </div>

        {/* Football Jargon Callout */}
        <div className="mt-4 mb-2 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#cb6d53] text-white font-display text-sm sm:text-base font-black tracking-wider uppercase shadow-xs">
            {jargon.badge}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#385345] dark:text-[#a0cbb0] mt-1.5 italic">
            "{jargon.phrase}"
          </p>
        </div>

        {/* Title */}
        <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#cb6d53] leading-none mt-2 mb-3">
          {mode === 'CLASSIC'
            ? isClassicWon
              ? 'A HISTÓRIA É SUA.'
              : 'FALTOU POUCO.'
            : isLegendWon
            ? '433 CRAVADOS.'
            : difference > 0
            ? 'PASSOU DO ALVO.'
            : 'FALTOU POUCO.'}
        </h2>

        {/* Description text */}
        <p className="text-xs sm:text-sm text-[#57685e] dark:text-[#90a699] max-w-md mx-auto leading-relaxed mb-6">
          {mode === 'CLASSIC' ? (
            isClassicWon ? (
              'Onze escolhas, 433 gols ou mais. Você montou um esquadrão para a história do futebol brasileiro.'
            ) : (
              `Você encerrou com ${totalGoals} gols. Faltaram apenas ${Math.abs(difference)} gols para alcançar os 433.`
            )
          ) : isLegendWon ? (
            'Precisão absoluta! Você atingiu exatamente 433 gols na soma dos 11 craques.'
          ) : difference > 0 ? (
            `Você marcou ${totalGoals} gols (+${difference} além do limite de 433). No Modo Lenda, a meta é exata!`
          ) : (
            `Você marcou ${totalGoals} gols (faltaram ${Math.abs(difference)} para os 433). Tente novamente!`
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRestart}
            className="px-6 py-2.5 rounded-lg bg-[#385345] hover:bg-[#2b4136] text-white font-display text-base font-bold tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>JOGAR DE NOVO</span>
          </button>

          <button
            onClick={onShare}
            className="px-4 py-2.5 rounded-lg border border-[#cbc7bc] dark:border-[#2d4638] bg-white dark:bg-[#182a20] hover:bg-[#faf9f6] text-[#385345] dark:text-[#8dc4a2] font-display text-base font-bold tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>COPIADO!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>COMPARTILHAR</span>
              </>
            )}
          </button>

          {onOpenRankings && (
            <button
              onClick={onOpenRankings}
              className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-base font-black tracking-wide uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Trophy className="w-4 h-4 fill-slate-950" />
              <span>Ver no Ranking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
