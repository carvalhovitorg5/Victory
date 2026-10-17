import React, { useState } from 'react';
import { Trophy, Sparkles, Share2, RotateCcw, Check, Star, AlertCircle } from 'lucide-react';
import { FormationType, GameMode, PitchSlot } from '../types/game';

interface MatchResultModalProps {
  slots: PitchSlot[];
  totalGoals: number;
  targetGoals: number;
  mode: GameMode;
  formation: FormationType;
  onRestart: () => void;
  trophyImgPath: string;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  slots,
  totalGoals,
  targetGoals,
  mode,
  formation,
  onRestart,
  trophyImgPath,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const difference = totalGoals - targetGoals;
  const isExactHit = totalGoals === targetGoals;
  const isClassicWon = mode === 'CLASSIC' && totalGoals >= targetGoals;
  const isLegendWon = mode === 'LEGEND' && isExactHit;
  const isWon = mode === 'CLASSIC' ? isClassicWon : isLegendWon;

  const legendaryCount = slots.filter(s => s.player?.isLegendary).length;

  const handleShare = () => {
    const playerLines = slots
      .filter(s => s.player)
      .map(s => `${s.position}: ${s.player!.name} (${s.player!.goals} gols)`)
      .join('\n');

    const resultText = `⚽ Brasileirão 433 - Jogo dos Gols 🇧🇷\n` +
      `Modo: ${mode === 'CLASSIC' ? 'Clássico' : 'Lenda (433 Exato)'} | Esquema: ${formation}\n` +
      `Total de Gols: ${totalGoals} / ${targetGoals} (${isWon ? '🏆 CAMPEÃO!' : 'Terminado'})\n` +
      `Cartas Lendárias: ${legendaryCount} ⭐\n\n` +
      `Meu Esquadrão:\n${playerLines}\n\n` +
      `Jogue agora e tente bater 433 gols!`;

    navigator.clipboard.writeText(resultText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#07190f] via-[#05140c] to-[#020b06] border-2 border-emerald-600/60 p-5 sm:p-7 shadow-2xl text-white relative">
        {/* Banner/Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-3 relative">
            <img
              src={trophyImgPath}
              alt="Troféu do Brasileirão"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(234,179,8,0.3)]"
            />
            {isWon && (
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
            )}
          </div>

          <div className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400 mb-1">
            Partida Finalizada · {formation}
          </div>

          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isWon ? 'text-yellow-400' : 'text-white'
          }`}>
            {mode === 'CLASSIC'
              ? isClassicWon
                ? '🏆 Campeão Brasileiro dos 433!'
                : 'Fim de Campeonato!'
              : isLegendWon
              ? '🌟 LENDA SUPREMA: 433 CRAVADOS!'
              : 'Desafio Modo Lenda Encerrado'}
          </h2>

          <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
            {mode === 'CLASSIC' ? (
              isClassicWon ? (
                `Sensacional! Seu time somou ${totalGoals} gols e superou a histórica meta dos 433!`
              ) : (
                `Você alcançou ${totalGoals} gols. Faltaram ${Math.abs(difference)} gols para o título dos 433.`
              )
            ) : isLegendWon ? (
              'Perfeição matemática e tática! Você atingiu exatamente o número místico de 433 gols!'
            ) : difference > 0 ? (
              `Passou da marca! Você fez ${totalGoals} gols (+${difference} além do limite de 433).`
            ) : (
              `Faltou pontaria! Você fez ${totalGoals} gols (${Math.abs(difference)} a menos dos 433).`
            )}
          </p>
        </div>

        {/* Big Score Box */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/50 border border-emerald-900/60 text-center mb-6">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total de Gols</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-yellow-400 tabular-nums">
              {totalGoals}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Meta do Jogo</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
              {targetGoals}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Lendários (Top 3)</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tabular-nums flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {legendaryCount}
            </div>
          </div>
        </div>

        {/* Squad Breakdown List */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Escalação Completa do Esquadrão
          </div>

          <div className="divide-y divide-emerald-950/80 rounded-xl bg-black/40 border border-emerald-900/40 overflow-hidden max-h-56 overflow-y-auto">
            {slots.map((slot, i) => {
              const p = slot.player;
              if (!p) return null;
              return (
                <div
                  key={slot.id}
                  className={`flex items-center justify-between px-3 py-2 text-xs ${
                    p.isLegendary ? 'bg-yellow-950/20 text-yellow-300' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 font-mono font-bold text-slate-400">
                      {slot.position}
                    </span>
                    <span className="font-semibold text-white">
                      {p.name}
                    </span>
                    {p.isLegendary && (
                      <span className="px-1.5 py-0.2 rounded bg-yellow-400/20 text-yellow-300 text-[10px] font-bold border border-yellow-500/30">
                        Top #{p.legendRank}
                      </span>
                    )}
                  </div>

                  <div className="font-mono font-bold text-white tabular-nums">
                    +{p.goals} gols
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleShare}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-emerald-700/60 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copiado com Sucesso!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Compartilhar Esquadrão</span>
              </>
            )}
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>
        </div>
      </div>
    </div>
  );
};
