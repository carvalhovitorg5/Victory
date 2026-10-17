import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Eye,
  Zap,
  MinusCircle,
  PlusCircle,
  Dices,
} from 'lucide-react';
import { Player, PositionType, SpecialCard } from '../types/game';
import { POSITION_NAMES } from '../data/players';
import { DraftOption } from '../utils/draft';
import { soundFx } from '../utils/audio';

interface DraftCardsProps {
  options: DraftOption[];
  onSelectPlayer: (player: Player) => void;
  onSelectSpecialCard: (card: SpecialCard, basePlayer: Player) => void;
  onReroll: () => void;
  rerollsLeft: number;
  currentRound: number;
  totalRounds: number;
  isPeekActive?: boolean;
  activeMultiplier?: number;
}

export const DraftCards: React.FC<DraftCardsProps> = ({
  options,
  onSelectPlayer,
  onSelectSpecialCard,
  onReroll,
  rerollsLeft,
  currentRound,
  totalRounds,
  isPeekActive = false,
  activeMultiplier = 1,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const handleCardClick = (option: DraftOption) => {
    if (isRevealed) return;

    setSelectedPlayerId(option.player.id);
    setIsRevealed(true);

    if (option.isSpecialCard && option.specialCard) {
      soundFx.playSpecialCardPick();
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FFFFFF'],
      });
    } else if (option.player.isLegendary) {
      soundFx.playLegendaryChime();
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#EAB308', '#385345', '#CB6D53'],
      });
    } else {
      soundFx.playGoalReveal();
    }
  };

  const handleConfirmAndNext = () => {
    if (!selectedPlayerId) return;
    const option = options.find(o => o.player.id === selectedPlayerId);
    if (option) {
      if (option.isSpecialCard && option.specialCard) {
        onSelectSpecialCard(option.specialCard, option.player);
      } else {
        onSelectPlayer(option.player);
      }
      setIsRevealed(false);
      setSelectedPlayerId(null);
    }
  };

  const getPositionTag = (pos: PositionType) => {
    switch (pos) {
      case 'ATA': return 'ATT';
      case 'MEI': return 'MID';
      case 'ZAG': return 'CB';
      case 'LE': return 'LB';
      case 'LD': return 'RB';
      case 'GOL': return 'GK';
      default: return pos;
    }
  };

  const getSpecialCardIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'eye': return <Eye className={className} />;
      case 'refresh': return <RefreshCw className={className} />;
      case 'zap': return <Zap className={className} />;
      case 'minus': return <MinusCircle className={className} />;
      case 'plus': return <PlusCircle className={className} />;
      case 'dices': return <Dices className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const selectedOption = options.find(o => o.player.id === selectedPlayerId);

  const hasSpecialCard = options.some(o => o.isSpecialCard && o.specialCard);

  return (
    <div className="w-full bg-[#f6f5ef] dark:bg-[#121f18] border border-[#d8d5cb] dark:border-[#263c30] rounded-xl overflow-hidden shadow-xs flex flex-col transition-colors">
      {/* Top Header of Stage */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#dedbd2] dark:border-[#22362a] text-xs font-bold uppercase tracking-wider text-[#6a7c72] dark:text-[#8ea598]">
        <span>
          RODADA <strong className="text-[#cb6d53] font-mono">{currentRound}</strong> / {totalRounds}
        </span>

        {/* Tactical Reroll */}
        {!isRevealed ? (
          <button
            onClick={() => {
              soundFx.playTick();
              onReroll();
            }}
            disabled={rerollsLeft <= 0}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold transition-all cursor-pointer ${
              rerollsLeft > 0
                ? 'bg-white dark:bg-[#182c21] border-[#cbc7bc] dark:border-[#2c4737] text-[#385345] dark:text-[#8dc4a2] hover:border-[#385345]'
                : 'bg-transparent border-transparent text-[#9ea9a2] dark:text-[#5a6b61] cursor-not-allowed'
            }`}
            title="Sorteia outros atletas e opções"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Troca ({rerollsLeft})</span>
          </button>
        ) : (
          <span className="text-[#385345] dark:text-[#8dc4a2] font-bold">GOLS REVELADOS</span>
        )}
      </div>

      {/* Draft Body */}
      <div className="p-4 sm:p-6 flex flex-col gap-5">
        <div className="text-center">
          <div className="text-[11px] uppercase font-bold tracking-widest text-[#728379] dark:text-[#8ea598] mb-1 flex items-center justify-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#cb6d53]" />
            <span>SORTEIO DA RODADA</span>
            <span className="w-3 h-0.5 bg-[#cb6d53]" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#24332b] dark:text-white">
            {!isRevealed
              ? hasSpecialCard
                ? 'ESCOLHA UM CRAQUE OU A CARTA ESPECIAL'
                : 'ESCOLHA UM CRAQUE'
              : 'CONFIRA A ESCOLHA E CONFIRME'}
          </h2>
        </div>

        {/* Active 2x Multiplier Notice Banner */}
        {activeMultiplier === 2 && (
          <div className="p-3 rounded-xl bg-amber-500/20 border-2 border-amber-500 text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs animate-pulse">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Lei do Ex Ativa: Gols do jogador que você escolher valerão o DOBRO (2X)!</span>
          </div>
        )}

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map(option => {
            const { player, isSpecialCard, specialCard } = option;
            const isSelected = selectedPlayerId === player.id;
            const isGolden = isRevealed && isSelected && player.isLegendary;

            // SPECIAL CARD PRESENTATION:
            // "Em uma das rodadas, aleatoriamente, uma das cartas aparece em vez de um dos atletas da rodada."
            // "assim o jogador pode ficar em um dilema se escolhe um atleta ou escolhe a carta que pode ajudar ele futuramente"
            if (isSpecialCard && specialCard) {
              return (
                <div
                  key={player.id}
                  onClick={() => handleCardClick(option)}
                  className={`relative rounded-xl p-4 sm:p-5 transition-all select-none flex flex-col justify-between min-h-[310px] border-2 cursor-pointer ${
                    !isRevealed
                      ? 'bg-gradient-to-br from-[#1c132b] via-[#241a38] to-[#12221b] text-white border-amber-400 hover:border-amber-300 hover:scale-[1.02] shadow-lg ring-2 ring-amber-400/30'
                      : isSelected
                      ? 'bg-gradient-to-br from-[#241838] via-[#2d1e44] to-[#172c21] text-white border-2 border-[#dfa024] shadow-xl ring-4 ring-[#dfa024]/40 scale-[1.01]'
                      : 'bg-[#eeece4] dark:bg-[#101b15] border-[#dedbd2] dark:border-[#1d2d24] opacity-40 text-slate-400'
                  }`}
                >
                  {/* Top: Special Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        CARTA ESPECIAL
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-900/70 text-purple-200 border border-purple-400/40">
                        {specialCard.badge}
                      </span>
                    </div>

                    {/* Card Title & Icon */}
                    <div className="flex items-start gap-2.5 mt-2">
                      <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                        {getSpecialCardIcon(specialCard.iconName, 'w-5 h-5')}
                      </div>
                      <div>
                        <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight text-white">
                          {specialCard.title}
                        </h3>
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                          {specialCard.shortLabel}
                        </span>
                      </div>
                    </div>

                    {/* Card Effect Description */}
                    <p className="text-xs text-slate-200 mt-2.5 leading-relaxed bg-black/30 p-2.5 rounded-lg border border-white/10">
                      {specialCard.description}
                    </p>
                  </div>

                  {/* Middle: Cria da Base & Tactical Dilemma callout */}
                  <div className="my-2.5 p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Vaga <strong>{player.position}</strong>: Cria da Base</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-300">+10 gols</span>
                  </div>

                  {/* Action / Select Button */}
                  <div className="pt-2 border-t border-white/10">
                    {!isRevealed ? (
                      <button className="w-full py-2 px-3 text-xs font-display font-black uppercase tracking-wider rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Escolher Carta Especial</span>
                      </button>
                    ) : isSelected ? (
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-300 py-0.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>Carta Especial Selecionada!</span>
                      </div>
                    ) : (
                      <div className="text-center text-[11px] text-slate-400 py-0.5">
                        Não escolhida
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // REGULAR ATHLETE CARD:
            return (
              <div
                key={player.id}
                onClick={() => handleCardClick(option)}
                className={`relative rounded-xl p-4 sm:p-5 transition-all select-none flex flex-col justify-between min-h-[310px] border ${
                  !isRevealed
                    ? isPeekActive
                      ? 'bg-cyan-950/10 dark:bg-[#122b28] border-cyan-500/50 hover:border-cyan-400 shadow-sm cursor-pointer'
                      : 'bg-white dark:bg-[#16271e] border-[#d8d5cb] dark:border-[#284132] hover:border-[#385345] dark:hover:border-[#528468] hover:shadow-md cursor-pointer active:scale-[0.98]'
                    : isGolden
                    ? 'bg-gradient-to-b from-[#fcf7e8] to-[#f7eed4] dark:from-[#2e240a] dark:to-[#221b06] border-2 border-[#dfa024] shadow-md ring-2 ring-[#dfa024]/30'
                    : isSelected
                    ? 'bg-white dark:bg-[#182c21] border-2 border-[#385345] dark:border-[#539b74] shadow-md'
                    : 'bg-[#eeece4] dark:bg-[#101b15] border-[#dedbd2] dark:border-[#1d2d24] opacity-50'
                }`}
              >
                {/* Top: Position & Tag */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#edf2ee] dark:bg-[#1c3327] text-[#385345] dark:text-[#9bc9b0] border border-[#c9d6ce] dark:border-[#2b4b39]">
                      {getPositionTag(player.position)} · {POSITION_NAMES[player.position]}
                    </span>

                    {(isRevealed || isPeekActive) && player.isLegendary && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#99620b] dark:text-amber-300 bg-[#fbf0d4] dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-[#dfa024]/50">
                        <Sparkles className="w-3 h-3 text-[#dfa024] fill-[#dfa024]" />
                        Top #{player.legendRank}
                      </span>
                    )}
                  </div>

                  {/* Player Name */}
                  <h3 className={`font-display text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight mt-1 mb-1.5 ${
                    isGolden ? 'text-[#855307] dark:text-amber-300' : 'text-[#202c25] dark:text-white'
                  }`}>
                    {player.name}
                  </h3>

                  {/* Clubs */}
                  <p className="text-xs text-[#5f7166] dark:text-[#8ea598] line-clamp-2 font-medium">
                    {player.clubs.join(' · ')}
                  </p>

                  <p className="text-[11px] text-[#86968c] dark:text-[#708579] mt-1 font-mono">
                    {player.era}
                  </p>
                </div>

                {/* Mystery vs Peeked vs Revealed Goals Area */}
                <div className="my-3">
                  {!isRevealed ? (
                    isPeekActive ? (
                      <div className="p-3.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border-2 border-cyan-500/70 text-center animate-in fade-in">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-cyan-800 dark:text-cyan-300 uppercase tracking-wider mb-0.5">
                          <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          <span>Olheiro VIP Revelou</span>
                        </div>
                        <div className="font-display text-3xl sm:text-4xl font-black text-cyan-950 dark:text-cyan-100 tabular-nums">
                          {player.goals} <span className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-400">Gols</span>
                        </div>
                        <div className="text-[10px] text-cyan-700 dark:text-cyan-300 font-semibold uppercase mt-0.5">
                          Clique para escalar
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-lg bg-[#f4f2ec] dark:bg-[#14231b] border border-[#d8d5cb] dark:border-[#273e31] text-center">
                        <div className="font-display text-3xl font-black text-[#56685e] dark:text-[#8ea598] tracking-widest">
                          ? GOLS
                        </div>
                        <div className="text-[10px] text-[#78897f] dark:text-[#6f8477] font-semibold uppercase tracking-wider mt-0.5">
                          Clique para escolher
                        </div>
                      </div>
                    )
                  ) : (
                    <div className={`p-3.5 rounded-lg border text-center transition-all ${
                      isGolden
                        ? 'bg-[#faeed0] dark:bg-amber-950/40 border-[#dfa024]'
                        : isSelected
                        ? 'bg-[#eaf1ec] dark:bg-[#1a3326] border-[#385345] dark:border-[#4f8a6b]'
                        : 'bg-[#e8e6de] dark:bg-[#101b15] border-[#d8d5cb] dark:border-[#223329]'
                    }`}>
                      <div className="flex items-baseline justify-center gap-1.5">
                        <span className={`font-display text-4xl sm:text-5xl font-black tabular-nums ${
                          isGolden
                            ? 'text-[#8b5606] dark:text-amber-300'
                            : isSelected
                            ? 'text-[#385345] dark:text-[#97d4b0]'
                            : 'text-[#7d8c83] dark:text-[#5f7368]'
                        }`}>
                          {player.goals}
                        </span>
                        <span className="text-xs font-bold uppercase text-[#5a6b61] dark:text-[#8ea598]">
                          Gols
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${
                        isGolden ? 'text-[#784f0e] dark:text-amber-200 font-medium' : 'text-[#5f7166] dark:text-[#8ea598]'
                      }`}>
                        {player.highlight}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Button / Action */}
                <div className="pt-2 border-t border-[#dedbd2] dark:border-[#22362a]">
                  {!isRevealed ? (
                    <button className="w-full py-2 px-3 text-xs font-display font-bold uppercase tracking-wider rounded-lg bg-[#385345] hover:bg-[#2a4034] text-white transition-all cursor-pointer">
                      Escalar Jogador
                    </button>
                  ) : isSelected ? (
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#385345] dark:text-[#8dc4a2] py-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#385345] dark:text-[#8dc4a2]" />
                      <span>Atleta Selecionado</span>
                    </div>
                  ) : (
                    <div className="text-center text-[11px] text-[#8e9d94] dark:text-[#5c6e64] py-0.5">
                      Não escolhido
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation Footer */}
        {isRevealed && selectedPlayerId && selectedOption && (
          <div className="pt-4 border-t border-[#dedbd2] dark:border-[#22362a] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#16271e] p-4 rounded-xl border border-[#d8d5cb] dark:border-[#263c30]">
            <div className="text-xs sm:text-sm text-[#46574d] dark:text-[#a0b8aa]">
              {selectedOption.isSpecialCard && selectedOption.specialCard ? (
                <div>
                  Escolhido:{' '}
                  <strong className="text-amber-600 dark:text-amber-300 font-black">
                    {selectedOption.specialCard.title}
                  </strong>{' '}
                  <span className="text-[#687d71] dark:text-[#90a89a]">
                    (+10 gols da Cria da Base na vaga de {selectedOption.player.position}. A carta virará um botão para você ativar quando quiser!)
                  </span>
                </div>
              ) : (
                <div>
                  Escolhido:{' '}
                  <strong className="text-[#202c25] dark:text-white font-bold">
                    {selectedOption.player.name}
                  </strong>{' '}
                  {activeMultiplier === 2 ? (
                    <span className="text-amber-600 dark:text-amber-300 font-black">
                      (+{selectedOption.player.goals * 2} gols [2x Lei do Ex!])
                    </span>
                  ) : (
                    <span>
                      (+{selectedOption.player.goals} gols somados ao total)
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                soundFx.playTick();
                handleConfirmAndNext();
              }}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-white font-display text-base font-bold tracking-wide uppercase transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                selectedOption.isSpecialCard
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-[#385345] hover:bg-[#273a2f]'
              }`}
            >
              <span>{selectedOption.isSpecialCard ? 'Confirmar Carta Especial' : 'Confirmar Escolha'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
