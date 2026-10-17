import React from 'react';
import { X, HelpCircle, Target, Sparkles, Shield, Trophy } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#081f13] via-[#05160d] to-[#020b06] border border-emerald-700/60 p-5 sm:p-7 shadow-2xl text-white relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Como Jogar o Brasileirão 433
            </h2>
            <p className="text-xs text-emerald-400/90 font-medium">
              Regras do draft e cálculo dos gols de pontos corridos
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-200">
          {/* Rule 1: The Goal */}
          <div className="p-4 rounded-xl bg-black/40 border border-emerald-900/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/30 font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-yellow-400" />
                O Objetivo dos 433 Gols
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                Inspirado no viral 4-4-2, sua missão é escalar 11 atletas do Brasileirão de pontos corridos (2003–presente) e somar os gols marcados por eles até alcançar a mítica marca de <strong>433 gols</strong>!
              </p>
            </div>
          </div>

          {/* Rule 2: Draft Mechanism */}
          <div className="p-4 rounded-xl bg-black/40 border border-emerald-900/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/30 font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Escolha Misteriosa & Revelação
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                A cada rodada aparecem <strong>3 atletas aleatórios</strong> com posições variadas. O valor total de gols que o jogador marcou no Brasileirão fica oculto (<strong>? Gols</strong>) e só é revelado após a sua escolha!
              </p>
            </div>
          </div>

          {/* Rule 3: Legendary Cards */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-yellow-950/20 border border-yellow-500/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-300 flex items-center justify-center shrink-0 border border-yellow-400/60 font-black">
              ⭐
            </div>
            <div>
              <h4 className="font-bold text-yellow-300 text-sm mb-1 flex items-center gap-1.5">
                Cartas Douradas Lendárias
              </h4>
              <p className="text-slate-200 leading-relaxed text-xs">
                Os <strong>3 maiores artilheiros históricos de cada posição</strong> (ex: Rogério Ceni com 65 gols no gol, Chicão com 36 na zaga, Diego Souza com 130 no meio, Fred com 158 no ataque) se revelam como <strong>Cartas Douradas Lendárias</strong> com efeitos visuais e sonoros especiais!
              </p>
            </div>
          </div>

          {/* Rule 4: Balance with Low Scorers */}
          <div className="p-4 rounded-xl bg-black/40 border border-emerald-900/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/30 font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                Equilíbrio Tático & Poucos Gols
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                O banco conta com goleiros paredões (Cássio, Fábio, Marcos com 0 gols) e marcadores de poucos gols. No Modo Lenda, eles são cruciais para não estourar a conta!
              </p>
            </div>
          </div>

          {/* Rule 5: Special Cards Dilemma */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-emerald-950/40 to-cyan-950/30 border border-amber-400/50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/60 font-black">
              ⚡
            </div>
            <div>
              <h4 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                Cartas Especiais: O Dilema da Rodada (1 por Jogo)
              </h4>
              <p className="text-slate-200 leading-relaxed text-xs">
                Em uma das rodadas do sorteio, <strong>uma Carta Especial aparece no lugar de um dos atletas</strong>! Você ficará em um dilema: escolher um craque para a vaga ou garantir a carta para o futuro (com uma <em>Cria da Base de 10 gols</em> assumindo a posição).
              </p>
              <p className="text-amber-200/90 leading-relaxed text-xs mt-1">
                A carta escolhida (como <strong>Olheiro VIP</strong> para ver gols, <strong>Substituição Tática</strong>, <strong>Lei do Ex</strong> para dobrar 2x gols, ou <strong>Ajustes de Gols</strong>) <em>vira um botão que só tem efeito quando você clicar</em>!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg shadow-yellow-500/20 active:scale-95"
        >
          Entendido, Vamos ao Jogo!
        </button>
      </div>
    </div>
  );
};
