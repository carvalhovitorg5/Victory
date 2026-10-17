import React from 'react';
import { X, Clock, Trophy, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { MatchHistoryItem } from '../types/game';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MatchHistoryItem[];
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#faf9f6] dark:bg-[#121f18] border border-[#d8d5cb] dark:border-[#263c30] p-5 sm:p-7 shadow-2xl text-[#1f2b24] dark:text-[#e4ede7] relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#eeece4] dark:bg-[#1c2e24] hover:bg-[#e4e1d7] dark:hover:bg-[#253d30] text-[#55665c] dark:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#385345] text-white flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#24332b] dark:text-white">
              Histórico Recente
            </h2>
            <p className="text-xs text-[#6a7c72] dark:text-[#8ea598] font-medium">
              Suas últimas 5 tentativas no Brasileirão 433
            </p>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-[#d8d5cb] dark:border-[#263c30] my-4">
            <Trophy className="w-8 h-8 mx-auto text-[#9faea5] mb-2" />
            <p className="text-sm font-semibold text-[#5a6b61] dark:text-[#9bb1a4]">
              Nenhuma partida finalizada ainda.
            </p>
            <p className="text-xs text-[#829288] dark:text-[#718579] mt-1">
              Complete sua escalação de 11 jogadores para registrar seu histórico!
            </p>
          </div>
        ) : (
          <div className="space-y-3 my-4">
            {history.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const isExact = item.totalGoals === item.targetGoals;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#d8d5cb] dark:border-[#253b2e] bg-white dark:bg-[#16271e] p-4 shadow-xs transition-all"
                >
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#eeece4] dark:bg-[#20362b] text-[#385345] dark:text-[#9cc4ad]">
                          #{index + 1}
                        </span>
                        <span className="text-xs text-[#6e7e75] dark:text-[#8ea598] font-mono">
                          {item.dateFormatted}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f4f2eb] dark:bg-[#1a2f24] text-[#4d5e54] dark:text-[#a0b8aa]">
                          {item.mode === 'CLASSIC' ? 'Clássico' : 'Lenda'} · {item.formation}
                        </span>
                      </div>

                      {/* Football Jargon Badge */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs font-display font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                          isExact
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : item.jargonBadge.includes('TRAVE')
                            ? 'bg-[#cb6d53] text-white'
                            : 'bg-[#385345] text-white'
                        }`}>
                          {item.jargonBadge}
                        </span>
                        <span className="text-xs text-[#526359] dark:text-[#9db3a6] italic truncate max-w-xs sm:max-w-sm">
                          "{item.jargonPhrase}"
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="font-display text-2xl font-black tabular-nums text-[#385345] dark:text-[#8dc4a2] leading-none">
                          {item.totalGoals} <span className="text-xs text-[#85978d] font-normal">/ 433</span>
                        </div>
                        <div className="text-[10px] text-[#7d8f84] dark:text-[#7f978a] font-medium mt-0.5">
                          {item.difference === 0
                            ? '433 Cravados!'
                            : item.difference > 0
                            ? `+${item.difference} além`
                            : `${item.difference} gols`}
                        </div>
                      </div>

                      <button className="text-[#6e8076] hover:text-[#24332b] dark:text-slate-400 dark:hover:text-white p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Squad Breakdown */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#eeece4] dark:border-[#22362a] animate-in fade-in">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#6e7e75] dark:text-[#8ea598] mb-2">
                        Escalação Completa
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {item.players.map((p, pIdx) => (
                          <div
                            key={pIdx}
                            className={`p-2 rounded text-xs border ${
                              p.isLegendary
                                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-300'
                                : 'bg-[#f8f7f3] dark:bg-[#1b2d23] border-[#e2dfd5] dark:border-[#24382c] text-[#334239] dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold text-[#7a8c82] dark:text-[#88a393]">
                              <span>{p.position}</span>
                              <span className="font-mono">{p.goals} gols</span>
                            </div>
                            <div className="font-bold truncate mt-0.5">
                              {p.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
