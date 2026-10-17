import { FormationType, GameMode, MatchHistoryItem, PitchSlot, RankingEntry, UserProfile } from '../types/game';
import { getFootballJargon } from './jargon';

const RANKINGS_KEY = 'brasileirao_433_rankings_entries';
const HISTORY_KEY = 'brasileirao_433_match_history_5';

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

const SEED_RANKINGS: RankingEntry[] = [
  {
    id: 'seed_1',
    userId: 'seed_u1',
    nickname: 'BaierDoGoiás',
    mode: 'LEGEND',
    formation: '4-3-3',
    totalGoals: 433,
    difference: 0,
    isExact: true,
    date: getTodayString(),
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'seed_2',
    userId: 'seed_u2',
    nickname: 'CeniArtilheiro',
    mode: 'CLASSIC',
    formation: '4-4-2',
    totalGoals: 434,
    difference: 1,
    isExact: false,
    date: getTodayString(),
    timestamp: Date.now() - 3600000 * 3,
  },
  {
    id: 'seed_3',
    userId: 'seed_u3',
    nickname: 'ReiDoPontosCorridos',
    mode: 'CLASSIC',
    formation: '3-4-3',
    totalGoals: 712,
    difference: 279,
    isExact: false,
    date: getTodayString(),
    timestamp: Date.now() - 3600000 * 4,
  },
  {
    id: 'seed_4',
    userId: 'seed_u4',
    nickname: 'MuralhaTricolor',
    mode: 'CLASSIC',
    formation: '4-5-1',
    totalGoals: 435,
    difference: 2,
    isExact: false,
    date: getTodayString(),
    timestamp: Date.now() - 3600000 * 5,
  },
  {
    id: 'seed_5',
    userId: 'seed_u5',
    nickname: 'FredGoleador',
    mode: 'CLASSIC',
    formation: '3-5-2',
    totalGoals: 654,
    difference: 221,
    isExact: false,
    date: getTodayString(),
    timestamp: Date.now() - 3600000 * 6,
  },
];

export function getRankings(): RankingEntry[] {
  if (typeof window === 'undefined') return SEED_RANKINGS;
  try {
    const raw = localStorage.getItem(RANKINGS_KEY);
    if (!raw) {
      localStorage.setItem(RANKINGS_KEY, JSON.stringify(SEED_RANKINGS));
      return SEED_RANKINGS;
    }
    const parsed: RankingEntry[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : SEED_RANKINGS;
  } catch {
    return SEED_RANKINGS;
  }
}

export async function fetchLiveRankings(): Promise<RankingEntry[]> {
  try {
    const res = await fetch('/api/rankings');
    if (res.ok) {
      const data: RankingEntry[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(RANKINGS_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // fallback to local cache
  }
  return getRankings();
}

export function saveRankingEntry(
  user: UserProfile,
  totalGoals: number,
  mode: GameMode,
  formation: FormationType
): RankingEntry {
  const current = getRankings();
  const diff = Math.abs(totalGoals - 433);
  const entry: RankingEntry = {
    id: `rank_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: user.id,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
    mode,
    formation,
    totalGoals,
    difference: diff,
    isExact: totalGoals === 433,
    date: getTodayString(),
    timestamp: Date.now(),
  };

  const updated = [entry, ...current];
  try {
    localStorage.setItem(RANKINGS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Also post asynchronously to backend API for shared live server state
  fetch('/api/rankings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
    .then(r => r.json())
    .then(serverUpdated => {
      if (Array.isArray(serverUpdated)) {
        localStorage.setItem(RANKINGS_KEY, JSON.stringify(serverUpdated));
      }
    })
    .catch(() => {});

  return entry;
}

// ==================== MATCH HISTORY (LAST 5 ATTEMPTS) ====================

export function getMatchHistory(): MatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addMatchToHistory(
  slots: PitchSlot[],
  totalGoals: number,
  mode: GameMode,
  formation: FormationType
): MatchHistoryItem[] {
  const history = getMatchHistory();
  const diff = totalGoals - 433;
  const isWon = mode === 'CLASSIC' ? totalGoals >= 433 : totalGoals === 433;
  const jargon = getFootballJargon(totalGoals, 433, mode);

  const players = slots
    .filter(s => s.player !== null)
    .map(s => ({
      name: s.player!.name,
      position: s.position,
      goals: s.player!.goals,
      isLegendary: s.player!.isLegendary,
    }));

  const legendaryCount = slots.filter(s => s.player?.isLegendary).length;

  const now = new Date();
  const dateFormatted = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const item: MatchHistoryItem = {
    id: `match_${Date.now()}`,
    timestamp: Date.now(),
    dateFormatted,
    mode,
    formation,
    totalGoals,
    targetGoals: 433,
    difference: diff,
    won: isWon,
    legendaryCount,
    jargonBadge: jargon.badge,
    jargonPhrase: jargon.phrase,
    players,
  };

  // Keep strictly the last 5 attempts
  const updated = [item, ...history].slice(0, 5);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return updated;
}
