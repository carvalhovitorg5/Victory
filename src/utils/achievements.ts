import { Achievement, FormationType, GameMode, Player } from '../types/game';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_match',
    title: 'Primeiro Apito',
    description: 'Complete sua primeira escalação de 11 jogadores no jogo.',
    iconName: 'Whistle',
    unlocked: false,
  },
  {
    id: 'mito_ceni',
    title: 'Mito dos Gols',
    description: 'Escale Rogério Ceni (65 gols), o maior goleiro-artilheiro do planeta.',
    iconName: 'Shield',
    unlocked: false,
  },
  {
    id: 'artilheiro_nato',
    title: 'Artilheiro Nato',
    description: 'Escale Fred (158 gols), Diego Souza (130) ou Gabigol (112).',
    iconName: 'Flame',
    unlocked: false,
  },
  {
    id: 'carta_dourada',
    title: 'Brilho Dourado',
    description: 'Revele uma Carta Lendária Dourada.',
    iconName: 'Sparkles',
    unlocked: false,
  },
  {
    id: 'esquadrao_ouro',
    title: 'Esquadrão de Ouro',
    description: 'Escale 3 ou mais Cartas Lendárias Douradas na mesma equipe.',
    iconName: 'Crown',
    unlocked: false,
  },
  {
    id: 'muralha_zero',
    title: 'Muralha Intransponível',
    description: 'Escale um goleiro com 0 gols para fechar a baliza.',
    iconName: 'Lock',
    unlocked: false,
  },
  {
    id: 'zagueiro_artilheiro',
    title: 'Zagueiro Artilheiro',
    description: 'Escale Chicão, Réver ou Leonardo Silva com mais de 30 gols.',
    iconName: 'Award',
    unlocked: false,
  },
  {
    id: 'campeao_classico',
    title: 'Campeão Brasileiro',
    description: 'Alcance a meta de 433 gols ou mais no Modo Clássico.',
    iconName: 'Trophy',
    unlocked: false,
  },
  {
    id: 'goleada_500',
    title: 'Goleada Histórica',
    description: 'Supere a incrível marca de 500 gols totais no seu esquadrão.',
    iconName: 'TrendingUp',
    unlocked: false,
  },
  {
    id: 'menos_100_gols',
    title: 'Retranca Histórica',
    description: 'Complete uma escalação de 11 jogadores somando menos de 100 gols no total.',
    iconName: 'ShieldAlert',
    unlocked: false,
  },
  {
    id: 'na_mosca',
    title: 'Na Mosca (433 Exato)',
    description: 'Alcance exatamente 433 gols! O feito supremo do Modo Lenda.',
    iconName: 'Target',
    unlocked: false,
  },
  {
    id: 'quase_la',
    title: 'Na Trave!',
    description: 'Termine uma partida a 5 gols ou menos do alvo de 433.',
    iconName: 'Compass',
    unlocked: false,
  },
  // Formations Wins
  {
    id: 'win_433',
    title: 'Glória no 4-3-3',
    description: 'Vença uma partida jogando no tradicional 4-3-3.',
    iconName: 'Trophy',
    unlocked: false,
  },
  {
    id: 'win_442',
    title: 'Equilíbrio no 4-4-2',
    description: 'Vença uma partida utilizando a formação 4-4-2.',
    iconName: 'Trophy',
    unlocked: false,
  },
  {
    id: 'win_451',
    title: 'Muralha do 4-5-1',
    description: 'Vença uma partida jogando no esquema povoado 4-5-1.',
    iconName: 'Trophy',
    unlocked: false,
  },
  {
    id: 'win_352',
    title: 'Penta no 3-5-2',
    description: 'Vença uma partida utilizando a clássica formação 3-5-2.',
    iconName: 'Trophy',
    unlocked: false,
  },
  {
    id: 'win_343',
    title: 'Pressão no 3-4-3',
    description: 'Vença uma partida no esquema ultraofensivo 3-4-3.',
    iconName: 'Trophy',
    unlocked: false,
  },
  {
    id: 'mestre_tatico_total',
    title: 'Mestre Tático Total',
    description: 'Conquiste vitórias em todas as 5 formações táticas do jogo!',
    iconName: 'Crown',
    unlocked: false,
  },
];

const STORAGE_KEY = 'brasileirao_433_achievements';
const WON_FORMATIONS_KEY = 'brasileirao_433_won_formations';

export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    const parsed: Record<string, { unlocked: boolean; unlockedAt?: string }> = JSON.parse(raw);
    return INITIAL_ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: parsed[ach.id]?.unlocked ?? false,
      unlockedAt: parsed[ach.id]?.unlockedAt,
    }));
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function checkAndUnlockAchievements(
  team: Player[],
  totalGoals: number,
  mode: GameMode,
  formation: FormationType,
  onUnlock?: (achievement: Achievement) => void
): Achievement[] {
  const current = getAchievements();
  const unlockedMap: Record<string, { unlocked: boolean; unlockedAt?: string }> = {};
  current.forEach(a => {
    unlockedMap[a.id] = { unlocked: a.unlocked, unlockedAt: a.unlockedAt };
  });

  const newlyUnlocked: Achievement[] = [];

  const unlock = (id: string) => {
    if (!unlockedMap[id]?.unlocked) {
      const now = new Date().toLocaleDateString('pt-BR');
      unlockedMap[id] = { unlocked: true, unlockedAt: now };
      const ach = current.find(a => a.id === id);
      if (ach) {
        newlyUnlocked.push({ ...ach, unlocked: true, unlockedAt: now });
      }
    }
  };

  // 1. First match completed
  if (team.length === 11) {
    unlock('first_match');
  }

  // 2. Rogerio Ceni
  if (team.some(p => p.id === 'gol_ceni')) {
    unlock('mito_ceni');
  }

  // 3. Artilheiro Nato
  if (team.some(p => ['ata_fred', 'ata_gabigol', 'mei_diego_souza', 'ata_wellington_paulista'].includes(p.id))) {
    unlock('artilheiro_nato');
  }

  // 4. Legendary card
  if (team.some(p => p.isLegendary)) {
    unlock('carta_dourada');
  }

  // 5. Triple legend
  const legendCount = team.filter(p => p.isLegendary).length;
  if (legendCount >= 3) {
    unlock('esquadrao_ouro');
  }

  // 6. Muralha zero
  const gk = team.find(p => p.position === 'GOL');
  if (gk && gk.goals === 0) {
    unlock('muralha_zero');
  }

  // 7. Zagueiro artilheiro
  if (team.some(p => p.position === 'ZAG' && p.goals >= 30)) {
    unlock('zagueiro_artilheiro');
  }

  const isWon = mode === 'CLASSIC' ? totalGoals >= 433 : totalGoals === 433;

  // 8. Campeao classico
  if (team.length === 11 && mode === 'CLASSIC' && totalGoals >= 433) {
    unlock('campeao_classico');
  }

  // 9. Goleada 500
  if (totalGoals >= 500) {
    unlock('goleada_500');
  }

  // 10. Retranca historica: menos de 100 gols
  if (team.length === 11 && totalGoals < 100) {
    unlock('menos_100_gols');
  }

  // 10. Na mosca (433 exato)
  if (team.length === 11 && totalGoals === 433) {
    unlock('na_mosca');
  }

  // 11. Na trave
  if (team.length === 11 && Math.abs(totalGoals - 433) > 0 && Math.abs(totalGoals - 433) <= 5) {
    unlock('quase_la');
  }

  // Formation specific wins
  if (team.length === 11 && isWon) {
    if (formation === '4-3-3') unlock('win_433');
    if (formation === '4-4-2') unlock('win_442');
    if (formation === '4-5-1') unlock('win_451');
    if (formation === '3-5-2') unlock('win_352');
    if (formation === '3-4-3') unlock('win_343');

    try {
      const rawWon = localStorage.getItem(WON_FORMATIONS_KEY);
      const wonList: string[] = rawWon ? JSON.parse(rawWon) : [];
      if (!wonList.includes(formation)) {
        wonList.push(formation);
        localStorage.setItem(WON_FORMATIONS_KEY, JSON.stringify(wonList));
      }
      if (['4-3-3', '4-4-2', '4-5-1', '3-5-2', '3-4-3'].every(f => wonList.includes(f))) {
        unlock('mestre_tatico_total');
      }
    } catch {
      // ignore
    }
  }

  // Save back to storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedMap));
  } catch {
    // ignore
  }

  // Trigger callbacks
  if (onUnlock) {
    newlyUnlocked.forEach(ach => onUnlock(ach));
  }

  return getAchievements();
}
