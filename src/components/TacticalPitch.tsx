import React, { useState } from 'react';
import { Sparkles, X, Info } from 'lucide-react';
import { PitchSlot, Player } from '../types/game';
import { POSITION_NAMES } from '../data/players';

interface TacticalPitchProps {
  slots: PitchSlot[];
  formationName: string;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({ slots, formationName }) => {
  const [inspectedPlayer, setInspectedPlayer] = useState<Player | null>(null);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Pitch Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            Prancheta Tática
          </span>
          <span className="text-xs text-slate-400 font-medium">· {formationName}</span>
        </div>
        <span className="text-xs text-slate-400">
          Clique no jogador para ver detalhes
        </span>
      </div>

      {/* The Football Pitch Arena */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/4.5] md:aspect-[4/4.2] max-h-[580px] rounded-2xl overflow-hidden border-2 border-emerald-800/80 shadow-2xl bg-gradient-to-b from-[#0a2e18] via-[#082613] to-[#051a0d]">
        {/* Grass Lawn Pattern (Striped Mowing Effect) */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #10b981 0px, #10b981 40px, transparent 40px, transparent 80px)',
          }}
        />

        {/* Pitch Chalk Lines */}
        <div className="absolute inset-3 border border-white/30 rounded-lg pointer-events-none">
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30 -translate-y-1/2" />

          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-white/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/40" />

          {/* Top Penalty Area (Opponent / Attack Area) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-28 border-b border-x border-white/30">
            {/* Small Goal Box */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-10 sm:h-12 border-b border-x border-white/30" />
            {/* Penalty Spot */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>

          {/* Bottom Penalty Area (Defense / Goalkeeper Area) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-28 border-t border-x border-white/30">
            {/* Small Goal Box */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-10 sm:h-12 border-t border-x border-white/30" />
            {/* Penalty Spot */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>

          {/* Corner Arcs */}
          <div className="absolute top-0 left-0 w-6 h-6 border-b border-r border-white/30 rounded-br-full" />
          <div className="absolute top-0 right-0 w-6 h-6 border-b border-l border-white/30 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-t border-r border-white/30 rounded-tr-full" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-t border-l border-white/30 rounded-tl-full" />
        </div>

        {/* 11 Position Slots */}
        {slots.map(slot => {
          const { player, position, label, x, y, id } = slot;
          const isFilled = !!player;
          const isLegendary = player?.isLegendary;

          return (
            <div
              key={id}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => {
                if (player) setInspectedPlayer(player);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
            >
              {isFilled ? (
                /* Filled Slot Card/Token */
                <div
                  className={`group cursor-pointer flex flex-col items-center transition-all transform hover:scale-110 active:scale-95 ${
                    isLegendary ? 'animate-pulse' : ''
                  }`}
                >
                  {/* Badge Token */}
                  <div
                    className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex flex-col items-center justify-center border-2 shadow-xl ${
                      isLegendary
                        ? 'bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 border-yellow-200 text-slate-950 shadow-yellow-500/40 ring-2 ring-yellow-400/60'
                        : 'bg-gradient-to-br from-emerald-800 to-slate-900 border-emerald-400 text-white shadow-black/50'
                    }`}
                  >
                    {isLegendary && (
                      <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 fill-yellow-300 drop-shadow" />
                    )}

                    <span className="text-[10px] sm:text-[11px] font-mono font-bold leading-none opacity-80">
                      {position}
                    </span>
                    <span className="text-xs sm:text-sm font-black font-mono leading-none mt-0.5 tabular-nums">
                      {player.goals}
                    </span>
                  </div>

                  {/* Player Name Pill underneath */}
                  <div
                    className={`mt-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold text-center whitespace-nowrap shadow-md max-w-[85px] sm:max-w-[105px] truncate border ${
                      isLegendary
                        ? 'bg-amber-950/90 text-yellow-300 border-yellow-500/60'
                        : 'bg-black/80 text-white border-emerald-800/60'
                    }`}
                  >
                    {player.name}
                  </div>
                </div>
              ) : (
                /* Empty Slot Placeholder */
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-emerald-400/50 bg-black/40 flex items-center justify-center text-emerald-300/80 text-[11px] font-mono font-bold backdrop-blur-xs">
                    {position}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400/70 font-medium mt-0.5 whitespace-nowrap">
                    {label.split(' ')[0]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Player Detail Modal on Click */}
      {inspectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setInspectedPlayer(null)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl relative ${
              inspectedPlayer.isLegendary
                ? 'bg-gradient-to-b from-[#251902] via-[#1a1202] to-[#0d0901] border-yellow-400/80 text-white'
                : 'bg-gradient-to-b from-[#0a2315] to-[#07160d] border-emerald-600/60 text-white'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setInspectedPlayer(null)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                {inspectedPlayer.position} · {POSITION_NAMES[inspectedPlayer.position]}
              </span>

              {inspectedPlayer.isLegendary && (
                <span className="flex items-center gap-1 text-[11px] font-black uppercase text-yellow-400 tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Lendário #{inspectedPlayer.legendRank}
                </span>
              )}
            </div>

            <h3 className="text-2xl font-black tracking-tight mb-1">
              {inspectedPlayer.name}
            </h3>

            <p className="text-xs text-slate-300 mb-4 font-medium">
              {inspectedPlayer.clubs.join(' · ')}
            </p>

            <div className="p-4 rounded-xl bg-black/40 border border-emerald-800/40 mb-4 text-center">
              <div className="text-4xl font-black font-mono text-yellow-400 tabular-nums">
                {inspectedPlayer.goals}
              </div>
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mt-1">
                Gols no Brasileirão
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed italic bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/40 mb-4">
              "{inspectedPlayer.highlight}"
            </p>

            <div className="text-[11px] text-slate-400 text-center">
              Período ativo: <span className="text-white font-mono">{inspectedPlayer.era}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
