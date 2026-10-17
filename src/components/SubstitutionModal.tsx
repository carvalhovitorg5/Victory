import React, { useState } from 'react';
import { X, RefreshCw, ArrowRight, UserCheck, Shield, Sparkles, Check } from 'lucide-react';
import { PitchSlot, Player } from '../types/game';
import { POSITION_NAMES } from '../data/players';
import { generateSubstitutionCandidates } from '../utils/specialCards';
import { soundFx } from '../utils/audio';

interface SubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: PitchSlot[];
  draftedPlayerIds: Set<string>;
  onConfirmSubstitution: (oldSlotId: string, newPlayer: Player) => void;
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  isOpen,
  onClose,
  slots,
  draftedPlayerIds,
  onConfirmSubstitution,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Player[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Player | null>(null);

  if (!isOpen) return null;

  // Filter slots that have a drafted player
  const filledSlots = slots.filter(s => s.player !== null);

  const handleSelectSlot = (slot: PitchSlot) => {
    setSelectedSlotId(slot.id);
    setSelectedCandidate(null);
    // Draw 3 fresh candidates for this position
    const drawn = generateSubstitutionCandidates(slot.position, slots, draftedPlayerIds);
    setCandidates(drawn);
    soundFx.playTick();
  };

  const handleSelectCandidate = (cand: Player) => {
    setSelectedCandidate(cand);
    soundFx.playTick();
  };

  const handleApplySubstitution = () => {
    if (!selectedSlotId || !selectedCandidate) return;
    soundFx.playWhistle();
    onConfirmSubstitution(selectedSlotId, selectedCandidate);
    onClose();
  };

  const activeSlot = slots.find(s => s.id === selectedSlotId);
  const oldPlayer = activeSlot?.player;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#f8f7f2] dark:bg-[#122218] border border-[#d8d5cb] dark:border-[#284233] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0ddd4] dark:border-[#1e3427] bg-[#eeece4] dark:bg-[#0e1b13]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#385345] dark:bg-[#203a2b] text-white flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#8dc4a2]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#cb6d53]">
                Dedo do Técnico
              </span>
              <h3 className="font-display text-xl font-black uppercase text-[#202c25] dark:text-white">
                Substituição Tática
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6d7f74] hover:text-[#202c25] dark:hover:text-white hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* STEP 1: Select which player to take off */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#5a6c61] dark:text-[#8ea598] mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#385345] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Escolha quem sai de campo:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
              {filledSlots.map(slot => {
                const isCurrent = slot.id === selectedSlotId;
                const player = slot.player!;

                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSelectSlot(slot)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-[#385345] text-white border-[#385345] shadow-xs'
                        : 'bg-white dark:bg-[#182c21] border-[#d8d5cb] dark:border-[#274032] text-[#202c25] dark:text-white hover:border-[#385345]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                      <span className={isCurrent ? 'text-emerald-200' : 'text-[#5a6c61] dark:text-[#8ea598]'}>
                        {slot.position} · {POSITION_NAMES[slot.position]}
                      </span>
                      <span className="font-mono">{player.goals} gols</span>
                    </div>

                    <div className="font-display font-black text-sm uppercase truncate mt-1">
                      {player.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Select who enters (candidates for that position) */}
          {selectedSlotId && oldPlayer && (
            <div className="pt-4 border-t border-[#dedbd2] dark:border-[#22362a] animate-in fade-in">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5a6c61] dark:text-[#8ea598] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#cb6d53] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Escolha o substituto para a vaga de {POSITION_NAMES[activeSlot!.position]}:</span>
              </div>

              {candidates.length === 0 ? (
                <div className="p-4 rounded-lg bg-[#eeece4] dark:bg-[#14231b] text-center text-xs text-[#6e7f74] dark:text-[#8ea598]">
                  Nenhum outro jogador disponível para esta posição no momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {candidates.map(cand => {
                    const isPicked = selectedCandidate?.id === cand.id;
                    const diff = cand.goals - oldPlayer.goals;

                    return (
                      <div
                        key={cand.id}
                        onClick={() => handleSelectCandidate(cand)}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                          isPicked
                            ? 'bg-[#385345] text-white border-[#385345] shadow-md ring-2 ring-[#8dc4a2]/40'
                            : 'bg-white dark:bg-[#182c21] border-[#d8d5cb] dark:border-[#274032] hover:border-[#385345]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#edf2ee] dark:bg-[#13241b] text-[#385345] dark:text-[#8dc4a2]">
                              {cand.position}
                            </span>
                            {cand.isLegendary && (
                              <span className="text-[10px] font-black uppercase text-[#dfa024] flex items-center gap-0.5">
                                <Sparkles className="w-3 h-3" />
                                Lenda
                              </span>
                            )}
                          </div>

                          <h4 className={`font-display text-base font-black uppercase leading-tight ${
                            isPicked ? 'text-white' : 'text-[#202c25] dark:text-white'
                          }`}>
                            {cand.name}
                          </h4>

                          <p className={`text-[11px] line-clamp-1 mt-0.5 ${
                            isPicked ? 'text-emerald-100' : 'text-[#5a6c61] dark:text-[#8ea598]'
                          }`}>
                            {cand.clubs.join(' · ')}
                          </p>
                        </div>

                        {/* Goals & Difference */}
                        <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                          <span className="font-display text-xl font-black tabular-nums">
                            {cand.goals} Gols
                          </span>

                          <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            diff > 0
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : diff < 0
                              ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                              : 'bg-slate-500/20 text-slate-700 dark:text-slate-300'
                          }`}>
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Preview and Confirmation Summary */}
          {oldPlayer && selectedCandidate && (
            <div className="p-3.5 rounded-xl bg-[#edf2ee] dark:bg-[#14291e] border border-[#c9d6ce] dark:border-[#274634] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#cb6d53] line-through">
                  {oldPlayer.name} ({oldPlayer.goals}g)
                </span>
                <ArrowRight className="w-4 h-4 text-[#385345] dark:text-[#8dc4a2]" />
                <span className="font-bold text-[#385345] dark:text-[#8dc4a2]">
                  {selectedCandidate.name} ({selectedCandidate.goals}g)
                </span>
              </div>

              <div className="text-right">
                Saldo de Gols:{' '}
                <strong className={selectedCandidate.goals - oldPlayer.goals >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {selectedCandidate.goals - oldPlayer.goals >= 0 ? `+${selectedCandidate.goals - oldPlayer.goals}` : selectedCandidate.goals - oldPlayer.goals} gols
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e0ddd4] dark:border-[#1e3427] bg-[#eeece4] dark:bg-[#0e1b13] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase text-[#5a6c61] dark:text-[#8ea598] hover:text-[#202c25] dark:hover:text-white cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleApplySubstitution}
            disabled={!selectedCandidate || !selectedSlotId}
            className={`px-5 py-2.5 rounded-lg font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              selectedCandidate && selectedSlotId
                ? 'bg-[#385345] hover:bg-[#283e33] text-white shadow-md active:scale-95'
                : 'bg-slate-400/40 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Substituição</span>
          </button>
        </div>
      </div>
    </div>
  );
};
