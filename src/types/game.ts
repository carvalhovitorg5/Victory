export type PositionType = 'GOL' | 'ZAG' | 'LD' | 'LE' | 'MEI' | 'ATA';

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  position: PositionType;
  goals: number;
  isLegendary: boolean; // Top 3 in their position (for GK, only >= 4 goals)
  legendRank?: 1 | 2 | 3;
  clubs: string[];
  era: string; // e.g. "2003-2015"
  highlight: string;
}

export type SpecialCardType =
  | 'PEEK_GOALS'
  | 'SUBSTITUTE_PLAYER'
  | 'DOUBLE_GOALS'
  | 'FINE_TUNE_MINUS'
  | 'FINE_TUNE_PLUS'
  | 'EXTRA_REROLLS';

export interface SpecialCard {
  id: string;
  type: SpecialCardType;
  title: string;
  shortLabel: string;
  badge: string;
  actionText: string;
  description: string;
  iconName: 'eye' | 'refresh' | 'zap' | 'minus' | 'plus' | 'dices';
  colorTheme: 'cyan' | 'amber' | 'emerald' | 'rose' | 'purple';
}

export interface DraftOption {
  player: Player;
  isEligible: boolean;
  reasonIneligible?: string;
  isSpecialCard?: boolean;
  specialCard?: SpecialCard;
}

export type FormationType = '4-3-3' | '4-4-2' | '4-5-1' | '3-5-2' | '3-4-3';

export interface PitchSlot {
  id: string;
  slotNumber: number;
  position: PositionType;
  label: string;
  x: number; // percentage on field 0-100
  y: number; // percentage on field 0-100
  player: Player | null;
}

export interface FormationConfig {
  type: FormationType;
  name: string;
  description: string;
  requiredCounts: Record<PositionType, number>;
  slots: Omit<PitchSlot, 'player'>[];
}

export type GameMode = 'CLASSIC' | 'LEGEND';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  iconName: string;
}

export interface FootballJargon {
  badge: string; // e.g. "NA TRAVE!", "CHUTOU NA ARQUIBANCADA!"
  phrase: string;
  tone: 'exact' | 'close' | 'near' | 'medium' | 'far' | 'over';
}

export interface MatchHistoryItem {
  id: string;
  timestamp: number;
  dateFormatted: string;
  mode: GameMode;
  formation: FormationType;
  totalGoals: number;
  targetGoals: number;
  difference: number;
  won: boolean;
  legendaryCount: number;
  jargonBadge: string;
  jargonPhrase: string;
  players: { name: string; position: PositionType; goals: number; isLegendary: boolean }[];
}

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  nickname: string;
  avatarUrl?: string;
  isGoogleLinked: boolean;
}

export interface RankingEntry {
  id: string;
  userId: string;
  nickname: string;
  avatarUrl?: string;
  mode: GameMode;
  formation: FormationType;
  totalGoals: number;
  difference: number; // abs(totalGoals - 433)
  isExact: boolean;
  date: string; // YYYY-MM-DD
  timestamp: number;
}
