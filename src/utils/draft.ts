import { PLAYERS_DATABASE } from '../data/players';
import { FormationConfig, PitchSlot, Player, PositionType, SpecialCard, DraftOption } from '../types/game';
import { createCriaDaBasePlayer } from './specialCards';

export type { DraftOption };

export function getOpenPositions(
  formation: FormationConfig,
  currentSlots: PitchSlot[]
): PositionType[] {
  const currentCounts: Record<PositionType, number> = {
    GOL: 0,
    ZAG: 0,
    LD: 0,
    LE: 0,
    MEI: 0,
    ATA: 0,
  };

  currentSlots.forEach(slot => {
    if (slot.player) {
      currentCounts[slot.position]++;
    }
  });

  const openPositions: PositionType[] = [];
  (Object.keys(formation.requiredCounts) as PositionType[]).forEach(pos => {
    if (currentCounts[pos] < formation.requiredCounts[pos]) {
      openPositions.push(pos);
    }
  });

  return openPositions;
}

export function generateDraftRound(
  formation: FormationConfig,
  currentSlots: PitchSlot[],
  draftedPlayerIds: Set<string>,
  specialCardToInject?: SpecialCard | null
): DraftOption[] {
  const openPositions = getOpenPositions(formation, currentSlots);

  if (openPositions.length === 0) {
    return [];
  }

  // Only players whose position is STILL OPEN in the formation are allowed in the pool
  const availablePlayers = PLAYERS_DATABASE.filter(
    p => !draftedPlayerIds.has(p.id) && openPositions.includes(p.position)
  );

  if (availablePlayers.length === 0) {
    return [];
  }

  // Number of athletes to pick: 2 if special card replaces 1, otherwise 3
  const targetAthleteCount = specialCardToInject ? 2 : 3;

  const chosenPlayers: Player[] = [];
  const chosenIds = new Set<string>();

  const shuffledOpenPositions = [...openPositions].sort(() => 0.5 - Math.random());

  // 1. Try to pick 1 player per distinct open position
  for (const pos of shuffledOpenPositions) {
    if (chosenPlayers.length >= targetAthleteCount) break;
    const candidatesForPos = availablePlayers.filter(
      p => p.position === pos && !chosenIds.has(p.id)
    );
    if (candidatesForPos.length > 0) {
      const picked = candidatesForPos[Math.floor(Math.random() * candidatesForPos.length)];
      chosenPlayers.push(picked);
      chosenIds.add(picked.id);
    }
  }

  // 2. If needed, fill from remaining eligible players
  const remainingEligible = availablePlayers
    .filter(p => !chosenIds.has(p.id))
    .sort(() => 0.5 - Math.random());

  for (const candidate of remainingEligible) {
    if (chosenPlayers.length >= targetAthleteCount) break;
    chosenPlayers.push(candidate);
    chosenIds.add(candidate.id);
  }

  const athleteOptions: DraftOption[] = chosenPlayers.map(player => ({
    player,
    isEligible: true,
  }));

  // If special card is to be injected, it replaces one of the athlete options!
  if (specialCardToInject) {
    // Pick an open position for the Cria da Base that accompanies the special card
    const targetPos = shuffledOpenPositions[0] || 'MEI';
    const basePlayer = createCriaDaBasePlayer(targetPos, 10);

    const specialCardOption: DraftOption = {
      player: basePlayer,
      isEligible: true,
      isSpecialCard: true,
      specialCard: specialCardToInject,
    };

    athleteOptions.push(specialCardOption);
  }

  // Shuffle the chosen options so the special card appears in a random slot (1, 2, or 3)
  return athleteOptions.sort(() => 0.5 - Math.random());
}

export function assignPlayerToFirstOpenSlot(
  player: Player,
  slots: PitchSlot[]
): PitchSlot[] {
  let assigned = false;
  return slots.map(slot => {
    if (!assigned && slot.position === player.position && !slot.player) {
      assigned = true;
      return { ...slot, player };
    }
    return slot;
  });
}
