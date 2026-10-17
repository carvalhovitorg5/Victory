import React, { useState, useMemo } from 'react';
import { X, Trophy, Target, Flame, Calendar, Award, User, Sparkles } from 'lucide-react';
import { RankingEntry, UserProfile } from '../types/game';

interface RankingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: RankingEntry[];
  user: UserProfile;
  onOpenProfile: () => void;
  onRefresh?: () => void;
}

export const RankingsModal: React.FC<RankingsModalProps> = ({
  isOpen,
  onClose,
  rankings,
  user,
  onOpenProfile,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'ACCURACY' | 'TOP_SCORER'>('ACCURACY');
  const [timeFilter, setTimeFilter] = useState<'TODAY' | 'ALL'>('TODAY');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter by today vs all
  const filteredList = useMemo(() => {
    let list = rankings;
    if (timeFilter === 'TODAY') {
      list = list.filter(r => r.date === todayStr);
    }
    return list;
  }, [rankings, timeFilter, todayStr]);

  // Sort according to tab
  const sortedList = useMemo(() => {
    const copy = [...filteredList];
    if (activeTab === 'ACCURACY') {
      // Sort by closest difference to 433 (diff ascending)
      return copy.sort((a, b) => {
        if (a.difference !== b.difference) {
          return a.difference - b.difference;
        }
        return b.timestamp - a.timestamp;
      });
    } else {
      // Sort by most total goals (descending)
      return copy.sort((a, b) => {
        if (a.totalGoals !== b.totalGoals) {
          return b.totalGoals - a.totalGoals;
        }
        return b.timestamp - a.timestamp;
      });
    }
  }, [filteredList, activeTab]);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#24332b] dark:text-white">
                Tabela de Líderes
              </h2>
              <p className="text-xs text-[#6a7c72] dark:text-[#8ea598] font-medium">
                Rankings Diários do Brasileirão 433
              </p>
            </div>
          </div>

          {/* Time Filter Buttons & Refresh */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-1 p-1 bg-[#eeece4] dark:bg-[#1c2e24] rounded-lg">
              <button
                onClick={() => setTimeFilter('TODAY')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  timeFilter === 'TODAY'
                    ? 'bg-white dark:bg-[#2a4335] text-[#24332b] dark:text-white shadow-2xs'
                    : 'text-[#627369] dark:text-[#8ba395] hover:text-[#24332b]'
                }`}
              >
                Hoje (Diário)
              </button>
              <button
                onClick={() => setTimeFilter('ALL')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  timeFilter === 'ALL'
                    ? 'bg-white dark:bg-[#2a4335] text-[#24332b] dark:text-white shadow-2xs'
                    : 'text-[#627369] dark:text-[#8ba395] hover:text-[#24332b]'
                }`}
              >
                Geral
              </button>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 rounded-lg border border-[#d8d5cb] dark:border-[#284132] bg-white dark:bg-[#1a2e22] text-[#385345] dark:text-emerald-400 hover:bg-[#faf9f6] transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                title="Atualizar ranking em tempo real"
              >
                <span>Atualizar</span>
              </button>
            )}
          </div>
        </div>

        {/* User Identity Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-[#d8d5cb] dark:border-[#253b2e] bg-white dark:bg-[#16271e] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#385345] text-white flex items-center justify-center text-xs font-bold font-display">
              {user.nickname.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#798b80] dark:text-[#7f978a]">
                Você joga como:
              </div>
              <div className="text-xs font-bold text-[#202c25] dark:text-white">
                {user.nickname}
                {user.isGoogleLinked && (
                  <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                    (Google Conectado)
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onOpenProfile}
            className="text-xs font-semibold text-[#cb6d53] hover:underline cursor-pointer"
          >
            Editar Nickname / Login
          </button>
        </div>

        {/* Ranking Category Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setActiveTab('ACCURACY')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              activeTab === 'ACCURACY'
                ? 'bg-[#385345] border-[#385345] text-white shadow-xs'
                : 'bg-white dark:bg-[#16271e] border-[#d8d5cb] dark:border-[#253b2e] text-[#55665c] dark:text-[#8ea598] hover:border-[#385345]'
            }`}
          >
            <Target className="w-4 h-4 text-amber-400" />
            <div>
              <div className="font-display font-bold text-sm tracking-wide uppercase leading-tight">
                Mais Próximos de 433
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                Pontuação exata e menor diferença
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('TOP_SCORER')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              activeTab === 'TOP_SCORER'
                ? 'bg-[#385345] border-[#385345] text-white shadow-xs'
                : 'bg-white dark:bg-[#16271e] border-[#d8d5cb] dark:border-[#253b2e] text-[#55665c] dark:text-[#8ea598] hover:border-[#385345]'
            }`}
          >
            <Flame className="w-4 h-4 text-[#cb6d53]" />
            <div>
              <div className="font-display font-bold text-sm tracking-wide uppercase leading-tight">
                Maior Artilharia
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                Quem marcou mais gols no total
              </div>
            </div>
          </button>
        </div>

        {/* Ranking List Table */}
        <div className="rounded-xl border border-[#d8d5cb] dark:border-[#253b2e] bg-white dark:bg-[#16271e] overflow-hidden shadow-xs">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-[#f4f2eb] dark:bg-[#1a2e22] border-b border-[#e2dfd5] dark:border-[#24382c] text-[10px] font-bold uppercase tracking-wider text-[#6e7e75] dark:text-[#8ea598]">
            <div className="col-span-2 sm:col-span-1">#</div>
            <div className="col-span-5 sm:col-span-6">Técnico / Nickname</div>
            <div className="col-span-2 sm:col-span-2">Esquema</div>
            <div className="col-span-3 sm:col-span-3 text-right">
              {activeTab === 'ACCURACY' ? 'Gols / Diferença' : 'Total de Gols'}
            </div>
          </div>

          <div className="divide-y divide-[#eeece4] dark:divide-[#22362a]">
            {sortedList.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#7d8f84] dark:text-[#7f978a]">
                Nenhuma pontuação registrada hoje ainda. Jogue agora e seja o primeiro!
              </div>
            ) : (
              sortedList.map((entry, idx) => {
                const isExact = entry.difference === 0;
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                return (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-12 items-center px-4 py-3 text-xs ${
                      entry.userId === user.id
                        ? 'bg-amber-50/60 dark:bg-amber-950/20'
                        : isExact
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                        : ''
                    }`}
                  >
                    {/* Rank Position */}
                    <div className="col-span-2 sm:col-span-1 font-display font-black text-sm">
                      {isFirst ? (
                        <span className="text-amber-500 flex items-center gap-0.5">
                          1º 🥇
                        </span>
                      ) : isSecond ? (
                        <span className="text-slate-400">2º 🥈</span>
                      ) : isThird ? (
                        <span className="text-amber-700">3º 🥉</span>
                      ) : (
                        <span className="text-[#7d8f84] dark:text-[#81998c] font-mono">
                          {idx + 1}º
                        </span>
                      )}
                    </div>

                    {/* Nickname & Badge */}
                    <div className="col-span-5 sm:col-span-6 flex items-center gap-2 min-w-0 pr-2">
                      <span className="font-bold text-[#202c25] dark:text-white truncate">
                        {entry.nickname}
                      </span>
                      {entry.userId === user.id && (
                        <span className="px-1.5 py-0.2 rounded bg-[#385345] text-white text-[9px] font-bold uppercase shrink-0">
                          Você
                        </span>
                      )}
                      {isExact && (
                        <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase shrink-0">
                          <Sparkles className="w-2.5 h-2.5" />
                          433 Exato
                        </span>
                      )}
                    </div>

                    {/* Formation */}
                    <div className="col-span-2 sm:col-span-2 font-mono text-[11px] text-[#63746a] dark:text-[#90a89a]">
                      {entry.formation}
                    </div>

                    {/* Goals / Result */}
                    <div className="col-span-3 sm:col-span-3 text-right">
                      {activeTab === 'ACCURACY' ? (
                        <div>
                          <div className={`font-display font-black text-sm tabular-nums ${
                            isExact ? 'text-amber-500' : 'text-[#385345] dark:text-[#8bc4a1]'
                          }`}>
                            {entry.totalGoals} gols
                          </div>
                          <div className="text-[10px] text-[#7d8f84] dark:text-[#7f978a] font-mono">
                            {isExact ? 'Na mosca!' : `dif: ${entry.difference}`}
                          </div>
                        </div>
                      ) : (
                        <div className="font-display font-black text-base text-[#cb6d53] tabular-nums">
                          {entry.totalGoals} gols
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
