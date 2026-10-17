import React from 'react';
import { Eye, RefreshCw, Zap, MinusCircle, PlusCircle, Dices, Sparkles, Check, Flame, ChevronRight } from 'lucide-react';
import { SpecialCard } from '../types/game';
import { soundFx } from '../utils/audio';

interface SpecialCardsBannerProps {
  availableCards: SpecialCard[];
  chosenCard: SpecialCard | null;
  isUsed: boolean;
  onChooseCard: (card: SpecialCard) => void;
  onActivateCard: () => void;
  isPeekActive: boolean;
  activeMultiplier: number;
  draftedCount: number;
}

export const SpecialCardsBanner: React.FC<SpecialCardsBannerProps> = ({
  availableCards,
  chosenCard,
  isUsed,
  onChooseCard,
  onActivateCard,
  isPeekActive,
  activeMultiplier,
  draftedCount,
}) => {
  const getCardIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'eye':
        return <Eye className={className} />;
      case 'refresh':
        return <RefreshCw className={className} />;
      case 'zap':
        return <Zap className={className} />;
      case 'minus':
        return <MinusCircle className={className} />;
      case 'plus':
        return <PlusCircle className={className} />;
      case 'dices':
        return <Dices className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // =========================================================================
  // STATE 1: Player already CHOSE their 1 special card and it is NOT yet used.
  // CRITICAL USER REQUIREMENT:
  // "Depois de escolhida, a carta vira um botão que só terá o efeito válido depois de clicado"
  // =========================================================================
  if (chosenCard && !isUsed) {
    const isSubstitutionDisabled = chosenCard.type === 'SUBSTITUTE_PLAYER' && draftedCount === 0;

    return (
      <div className="w-full rounded-xl bg-gradient-to-r from-[#182e22] via-[#203c2d] to-[#182e22] dark:from-[#13271c] dark:via-[#1c3829] dark:to-[#13271c] border-2 border-[#dfa024] p-3.5 sm:p-4 shadow-lg text-white animate-in fade-in transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Card Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#dfa024]/20 border border-[#dfa024]/60 flex items-center justify-center text-[#dfa024] shrink-0">
              {getCardIcon(chosenCard.iconName, 'w-5 h-5')}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#dfa024] text-slate-950">
                  {chosenCard.badge}
                </span>
                <span className="text-xs font-bold text-[#b5dec4] uppercase tracking-wide">
                  Sua Carta Especial do Jogo
                </span>
              </div>
              <h4 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-tight mt-0.5">
                {chosenCard.title}
              </h4>
              <p className="text-xs text-[#a3c2b0] max-w-md leading-snug">
                {chosenCard.description}
              </p>
            </div>
          </div>

          {/* THE BUTTON: Only executes effect when clicked! */}
          <div className="w-full sm:w-auto shrink-0 flex flex-col items-end gap-1">
            <button
              onClick={() => {
                if (isSubstitutionDisabled) return;
                soundFx.playPowerUpActivate();
                onActivateCard();
              }}
              disabled={isSubstitutionDisabled}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-display text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 ${
                isSubstitutionDisabled
                  ? 'bg-slate-700/60 text-slate-400 border border-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#dfa024] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#dfa024] text-slate-950 border border-yellow-300 ring-2 ring-[#dfa024]/40 hover:scale-[1.02]'
              }`}
            >
              {getCardIcon(chosenCard.iconName, 'w-4 h-4')}
              <span>{chosenCard.actionText}</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>

            {isSubstitutionDisabled && (
              <span className="text-[10px] text-amber-300 font-semibold text-center sm:text-right">
                Escala ao menos 1 jogador para poder substituir
              </span>
            )}
          </div>
        </div>

        {/* Real-time active indicators */}
        {isPeekActive && (
          <div className="mt-2.5 pt-2 border-t border-[#2a4d3a] flex items-center gap-2 text-xs text-cyan-300 font-bold">
            <Eye className="w-3.5 h-3.5" />
            <span>Olheiro Ativo: Os gols dos 3 atletas abaixo foram revelados para você!</span>
          </div>
        )}

        {activeMultiplier === 2 && (
          <div className="mt-2.5 pt-2 border-t border-[#2a4d3a] flex items-center gap-2 text-xs text-yellow-300 font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Lei do Ex Ativa: O próximo atleta escalado terá seus gols dobrados (2x)!</span>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // STATE 2: Player already USED their 1 special card.
  // =========================================================================
  if (chosenCard && isUsed) {
    return (
      <div className="w-full rounded-lg bg-[#f0eee6] dark:bg-[#122018] border border-[#d6d3c8] dark:border-[#22362a] px-3.5 py-2 flex items-center justify-between text-xs text-[#526358] dark:text-[#8ea598]">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-[#385345] dark:text-[#539b74]" />
          <span>
            Carta Especial utilizada nesta partida:{' '}
            <strong className="text-[#202c25] dark:text-white font-bold">{chosenCard.title}</strong>
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#78887e] dark:text-[#6b8073]">
          (Limite: 1 por jogo)
        </span>
      </div>
    );
  }

  // If no card has been chosen yet, do not render a separate banner
  // because the special card appears directly inside the round draft options!
  return null;
};
