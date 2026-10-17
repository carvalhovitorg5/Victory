import React from 'react';
import { PitchSlot, FormationType, GameMode } from '../types/game';
import { Sparkles } from 'lucide-react';

interface SquadBoardProps {
  slots: PitchSlot[];
  formation: FormationType;
  totalGoals: number;
  targetGoals: number;
  mode: GameMode;
  onSlotClick?: (slot: PitchSlot) => void;
}

export const SquadBoard: React.FC<SquadBoardProps> = ({
  slots,
  formation,
  totalGoals,
  targetGoals,
  mode,
  onSlotClick,
}) => {
  const draftedCount = slots.filter(s => s.player !== null).length;
  const progressPercent = Math.round((draftedCount / 11) * 100);

  // Group slots into rows for the tactical board
  const attSlots = slots.filter(s => s.position === 'ATA');
  const midSlots = slots.filter(s => s.position === 'MEI');
  const defSlots = slots.filter(s => ['ZAG', 'LE', 'LD'].includes(s.position));
  const gkSlots = slots.filter(s => s.position === 'GOL');

  const getPositionTag = (pos: string) => {
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

  const renderSlotCard = (slot: PitchSlot) => {
    const { player, position, id } = slot;
    const isFilled = !!player;
    const isLegendary = player?.isLegendary;

    return (
      <div
        key={id}
        onClick={() => isFilled && onSlotClick?.(slot)}
        className={`flex-1 min-w-[70px] p-2.5 sm:p-3 rounded-lg border text-center transition-all select-none ${
          isFilled
            ? isLegendary
              ? 'bg-[#fcf8ee] dark:bg-[#2a220d] border-amber-400 dark:border-amber-500 shadow-sm cursor-pointer hover:border-amber-500'
              : 'bg-[#faf9f6] dark:bg-[#16271e] border-[#d8d5cb] dark:border-[#263c30] shadow-xs cursor-pointer hover:border-[#385345]'
            : 'border-dashed border-[#cbc7bc] dark:border-[#2b4133] bg-[#f4f2ec]/60 dark:bg-[#14231b]/50'
        }`}
      >
        {/* Position Tag */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-[10px] font-bold tracking-wider text-[#798a80] dark:text-[#8ba395] uppercase">
            {getPositionTag(position)}
          </span>
          {isLegendary && (
            <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
          )}
        </div>

        {/* Player Name */}
        <div
          className={`font-display font-bold uppercase tracking-wide text-xs sm:text-sm mt-0.5 truncate leading-tight ${
            isFilled
              ? isLegendary
                ? 'text-[#8b5a0e] dark:text-amber-300'
                : 'text-[#24332b] dark:text-white'
              : 'text-[#9b988f] dark:text-[#5d7366] italic'
          }`}
          title={player ? player.name : undefined}
        >
          {isFilled ? player.name : '—'}
        </div>

        {/* Goals */}
        <div className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#6d7e74] dark:text-[#8ea598] mt-0.5">
          {isFilled ? `${player.goals} GOLS` : 'VAZIO'}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#f6f5ef] dark:bg-[#121f18] border border-[#d8d5cb] dark:border-[#263c30] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col gap-4 transition-colors">
      {/* Top Header of SEU XI */}
      <div className="flex items-center justify-between pb-2 border-b border-[#dedbd2] dark:border-[#22362a]">
        <h3 className="font-display text-2xl font-black tracking-tight text-[#2d4638] dark:text-white uppercase">
          SEU XI
        </h3>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#6e7e75] dark:text-[#8ea598]">
          FORMAÇÃO {formation}
        </span>
      </div>

      {/* Gols na Conta & Alvo Box */}
      <div className="w-full bg-[#385345] dark:bg-[#193325] border border-transparent dark:border-[#274635] rounded-xl p-4 text-white flex items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#a8c2b3]">
            GOLS NA CONTA
          </div>
          <div className="font-display text-4xl sm:text-5xl font-black tracking-tight flex items-baseline gap-1 tabular-nums mt-0.5 text-white">
            <span>{totalGoals}</span>
            <span className="text-xl sm:text-2xl text-[#8fa89b] font-normal">
              / {targetGoals}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#a8c2b3]">
            ALVO
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-[#dca124] tracking-tight mt-0.5">
            {targetGoals} gols
          </div>
        </div>
      </div>

      {/* Escalacao Progress Strip */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5d6f65] dark:text-[#8ea598]">
          <span className="uppercase tracking-wider">ESCALAÇÃO</span>
          <span className="font-mono text-[#2d4638] dark:text-white">
            {draftedCount} / 11
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#dfdcce] dark:bg-[#1f3327] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#cb6d53] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Formation Grid Organized by Tiers */}
      <div className="flex flex-col gap-2.5 pt-1">
        {/* Row 1: Attackers */}
        {attSlots.length > 0 && (
          <div className="flex items-center gap-2">
            {attSlots.map(renderSlotCard)}
          </div>
        )}

        {/* Row 2: Midfielders */}
        {midSlots.length > 0 && (
          <div className="flex items-center gap-2">
            {midSlots.map(renderSlotCard)}
          </div>
        )}

        {/* Row 3: Defenders */}
        {defSlots.length > 0 && (
          <div className="flex items-center gap-2">
            {defSlots.map(renderSlotCard)}
          </div>
        )}

        {/* Row 4: Goalkeeper */}
        {gkSlots.length > 0 && (
          <div className="flex items-center justify-center">
            <div className="w-1/2 min-w-[120px]">
              {renderSlotCard(gkSlots[0])}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
