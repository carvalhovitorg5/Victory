import { PLAYERS_DATABASE } from '../data/players';
import { GameMode, PitchSlot, Player, PositionType, SpecialCard, SpecialCardType } from '../types/game';

export const SPECIAL_CARDS_CATALOG: Omit<SpecialCard, 'id'>[] = [
  {
    type: 'PEEK_GOALS',
    title: 'Olheiro VIP (Ver Gols)',
    shortLabel: 'Visualizar Gols',
    badge: 'ESPIONAGEM',
    actionText: 'Revelar Gols dos 3 Atletas',
    description: 'Revela antecipadamente os gols dos 3 atletas sorteados na rodada atual antes da sua escolha.',
    iconName: 'eye',
    colorTheme: 'cyan',
  },
  {
    type: 'SUBSTITUTE_PLAYER',
    title: 'Substituição Tática',
    shortLabel: 'Substituir Jogador',
    badge: 'DEDO DO TÉCNICO',
    actionText: 'Trocar um Jogador Escalado',
    description: 'Substitui um atleta que você já escalou por outro da mesma posição para recalcular os gols.',
    iconName: 'refresh',
    colorTheme: 'emerald',
  },
  {
    type: 'DOUBLE_GOALS',
    title: 'Lei do Ex (2x Gols)',
    shortLabel: 'Dobrar Próximo',
    badge: 'MULTIPLICADOR',
    actionText: 'Ativar 2x no Próximo Atleta',
    description: 'Dobra o número de gols (2x) do próximo atleta que você escalar na rodada!',
    iconName: 'zap',
    colorTheme: 'amber',
  },
  {
    type: 'FINE_TUNE_MINUS',
    title: 'Desconto do VAR (-10 Gols)',
    shortLabel: '-10 Gols',
    badge: 'CALIBRAGEM',
    actionText: 'Descontar 10 Gols do Total',
    description: 'Reduz 10 gols do placar do seu time. Fundamental para cravar os 433 exatos no Modo Lenda.',
    iconName: 'minus',
    colorTheme: 'rose',
  },
  {
    type: 'FINE_TUNE_PLUS',
    title: 'Gol de Placa (+10 Gols)',
    shortLabel: '+10 Gols',
    badge: 'BÔNUS',
    actionText: 'Somar +10 Gols ao Total',
    description: 'Concede 10 gols extras imediatos ao total do seu esquadrão.',
    iconName: 'plus',
    colorTheme: 'purple',
  },
  {
    type: 'EXTRA_REROLLS',
    title: 'Janela Extra (+2 Trocas)',
    shortLabel: '+2 Trocas',
    badge: 'DIRETORIA',
    actionText: 'Adicionar +2 Trocas de Rodada',
    description: 'Libera mais 2 trocas da rodada (rerolls) para buscar os craques ideais.',
    iconName: 'dices',
    colorTheme: 'amber',
  },
];

export function generateRoundSpecialCards(
  round: number,
  draftedCount: number,
  currentGoals: number,
  mode: GameMode
): SpecialCard[] {
  // Pool of candidate types
  const eligibleTypes: SpecialCardType[] = ['PEEK_GOALS', 'DOUBLE_GOALS', 'EXTRA_REROLLS'];

  // Substitution is only offered if at least 1 player has already been drafted
  if (draftedCount >= 1) {
    eligibleTypes.push('SUBSTITUTE_PLAYER');
  }

  // Fine-tuning cards are especially relevant from round 4 onwards or when goals are high
  if (round >= 4 || currentGoals > 250 || mode === 'LEGEND') {
    eligibleTypes.push('FINE_TUNE_MINUS');
    eligibleTypes.push('FINE_TUNE_PLUS');
  }

  // Pick 2 distinct special card templates
  const shuffled = [...eligibleTypes].sort(() => 0.5 - Math.random());
  const selectedTypes = shuffled.slice(0, 2);

  return selectedTypes.map(type => {
    const template = SPECIAL_CARDS_CATALOG.find(c => c.type === type)!;
    return {
      ...template,
      id: `sc_${type.toLowerCase()}_${round}_${Math.random().toString(36).substring(2, 6)}`,
    };
  });
}

export function generateSubstitutionCandidates(
  targetPosition: PositionType,
  currentSlots: PitchSlot[],
  draftedPlayerIds: Set<string>
): Player[] {
  // Find all players of that position who are not currently drafted in ANY slot
  const currentlyOnPitchIds = new Set(
    currentSlots.filter(s => s.player !== null).map(s => s.player!.id)
  );

  const pool = PLAYERS_DATABASE.filter(
    p => p.position === targetPosition && !currentlyOnPitchIds.has(p.id)
  );

  // Pick 3 random candidates
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export function getRandomSpecialCard(
  round: number,
  draftedCount: number,
  currentGoals: number,
  mode: GameMode
): SpecialCard {
  const cards = generateRoundSpecialCards(round, draftedCount, currentGoals, mode);
  return cards[Math.floor(Math.random() * cards.length)];
}

export function createCriaDaBasePlayer(position: PositionType, goals = 10): Player {
  const baseNames: Record<PositionType, string[]> = {
    GOL: ['Jovem da Base (Goleiro)', 'Garoto da Colina', 'Promessa do Ninho'],
    ZAG: ['Cria de Cotia (Zagueiro)', 'Menino da Vila (Zaga)', 'Garoto da Base (Zagueiro)'],
    LD: ['Lateral da Base (LD)', 'Ala Promissor (LD)', 'Garoto do Terrão (LD)'],
    LE: ['Lateral da Base (LE)', 'Cria da Toca (LE)', 'Menino da Vila (LE)'],
    MEI: ['Garoto da Base (Meia)', 'Joia da Base (MEI)', 'Cria da Academia (MEI)'],
    ATA: ['Promessa do Terrão (ATA)', 'Raio da Vila (ATA)', 'Garoto da Base (Atacante)'],
  };
  const list = baseNames[position] || ['Garoto da Base'];
  const name = list[Math.floor(Math.random() * list.length)];

  return {
    id: `base_${position.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: `★ ${name}`,
    nickname: 'Cria da Base',
    position,
    goals,
    isLegendary: false,
    clubs: ['Categorias de Base'],
    era: 'Atual',
    highlight: `Promovido da base com ${goals} gols na rodada da Carta Especial!`,
  };
}
