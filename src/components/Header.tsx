import React from 'react';
import { Volume2, VolumeX, HelpCircle, Award, RotateCcw, Moon, Sun, Clock, Trophy, User } from 'lucide-react';
import { UserProfile } from '../types/game';

interface HeaderProps {
  onOpenHowToPlay: () => void;
  onOpenAchievements: () => void;
  onOpenHistory: () => void;
  onOpenRankings: () => void;
  onOpenProfile: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: UserProfile;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowToPlay,
  onOpenAchievements,
  onOpenHistory,
  onOpenRankings,
  onOpenProfile,
  onRestart,
  isMuted,
  onToggleMute,
  isDarkMode,
  onToggleDarkMode,
  user,
  unlockedAchievementsCount,
  totalAchievementsCount,
}) => {
  return (
    <header className={`w-full border-b sticky top-0 z-40 transition-colors ${
      !isDarkMode
        ? 'bg-[#07170e]/95 backdrop-blur-md border-emerald-900/60'
        : 'bg-[#f4f2ec] dark:bg-[#121f18] border-[#dedbd2] dark:border-[#263c30]'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={`w-7 h-7 rounded flex items-center justify-center font-display font-black text-sm shadow-xs ${
            !isDarkMode ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950' : 'bg-[#385345] text-white'
          }`}>
            433
          </div>
          <span className={`font-display font-black tracking-tight text-lg sm:text-xl uppercase ${
            !isDarkMode ? 'text-white' : 'text-[#24332b] dark:text-white'
          }`}>
            Brasileirão <span className={!isDarkMode ? 'text-yellow-400' : 'text-[#cb6d53]'}>433</span>
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-[#5a6b61] dark:text-[#91a79a]">
          <button
            onClick={onOpenRankings}
            className="flex items-center gap-1.5 hover:text-[#24332b] dark:hover:text-white transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Ranking Diário</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 hover:text-[#24332b] dark:hover:text-white transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#385345] dark:text-[#88be9d]" />
            <span>Últimas 5</span>
          </button>

          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1.5 hover:text-[#24332b] dark:hover:text-white transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#cb6d53]" />
            <span>Conquistas</span>
            <span className="font-mono text-xs text-[#385345] dark:text-[#8dc4a2]">
              ({unlockedAchievementsCount}/{totalAchievementsCount})
            </span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 hover:text-[#24332b] dark:hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#385345] dark:text-[#88be9d]" />
            <span>Regras</span>
          </button>
        </nav>

        {/* Action Controls & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* User Nickname Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#cbc7bc] dark:border-[#2d4637] bg-white dark:bg-[#16271e] hover:bg-[#faf9f6] text-xs font-semibold text-[#202c25] dark:text-white transition-colors cursor-pointer shadow-2xs max-w-[125px] sm:max-w-[170px]"
            title="Editar nickname ou gerenciar login Google"
          >
            <User className="w-3.5 h-3.5 text-[#385345] dark:text-emerald-400 shrink-0" />
            <span className="truncate">{user.nickname}</span>
          </button>

          {/* Mobile Quick Navigation Trigger */}
          <button
            onClick={onOpenRankings}
            className="md:hidden p-1.5 rounded-lg border border-[#cbc7bc] dark:border-[#2d4637] bg-white dark:bg-[#16271e] text-amber-500 cursor-pointer"
            title="Ver Rankings Diários"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHistory}
            className="md:hidden p-1.5 rounded-lg border border-[#cbc7bc] dark:border-[#2d4637] bg-white dark:bg-[#16271e] text-[#385345] dark:text-[#88be9d] cursor-pointer"
            title="Ver Histórico de Tentativas"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="p-1.5 rounded-lg border border-[#cbc7bc] dark:border-[#2d4637] bg-white dark:bg-[#16271e] hover:bg-[#faf9f6] text-[#55665c] dark:text-amber-300 transition-colors cursor-pointer shadow-2xs"
            title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            className="p-1.5 rounded-lg border border-[#cbc7bc] dark:border-[#2d4637] bg-white dark:bg-[#16271e] hover:bg-[#faf9f6] text-[#55665c] dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
            title={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#385345] dark:text-[#88be9d]" />}
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-white bg-[#385345] hover:bg-[#293d33] rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
