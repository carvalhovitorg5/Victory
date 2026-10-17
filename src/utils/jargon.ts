import { FootballJargon, GameMode } from '../types/game';

interface JargonOption {
  badge: string;
  phrase: string;
}

const EXACT_JARGONS: JargonOption[] = [
  {
    badge: 'GOLAÇO NO ÂNGULO!',
    phrase: 'Onde a coruja dorme e o goleiro nem pula! 433 cravados na gaveta com categoria!',
  },
  {
    badge: 'NA GAVETA!',
    phrase: 'Caixa postal do homem lá em cima! 433 gols milimetricamente calculados!',
  },
  {
    badge: 'QUE PINTURA!',
    phrase: 'Gol de placa no Maracanã! Põe no DVD e guarda pra eternidade!',
  },
  {
    badge: 'GOL DE ANTOLOGIA!',
    phrase: 'Nem com GPS e régua achava uma pontuação tão perfeita! Fez história!',
  },
];

const OVER_CLOSE_JARGONS: JargonOption[] = [
  {
    badge: 'FALTA DE ATAQUE!',
    phrase: 'Passou da linha da bola por um triz! Estourou a cota por apenas alguns gols!',
  },
  {
    badge: 'IMPEDIDO!',
    phrase: 'O ataque foi com tanta sede ao pote que queimou a largada e passou dos 433!',
  },
  {
    badge: 'TROMBOU NO GOLEIRO!',
    phrase: 'Quase acertou o alvo exato, mas a bola caprichosa passou do ponto!',
  },
];

const OVER_FAR_JARGONS: JargonOption[] = [
  {
    badge: 'ENTROU DE SOLA!',
    phrase: 'Pisou fundo demais e atropelou a meta dos 433! No Modo Lenda, a precisão é sagrada!',
  },
  {
    badge: 'PASSOU DO PONTO!',
    phrase: 'O time foi com tanta fome pro ataque que engoliu a baliza inteira!',
  },
  {
    badge: 'PÊNALTI CONTRA!',
    phrase: 'Exagerou no poder de fogo e estourou a conta! Hora de recalibrar a zaga.',
  },
];

const CLOSE_JARGONS: JargonOption[] = [
  {
    badge: 'NA TRAVE!',
    phrase: 'Tirou tinta da trave! O estádio inteiro já estava em pé soltando o grito de gol!',
  },
  {
    badge: 'CARIMBOU O POSTE!',
    phrase: 'Estremeceu o travessão! Essa bola vai passar a noite inteira zumbindo no ouvido do zagueiro!',
  },
  {
    badge: 'UH, QUASE!',
    phrase: 'O grito de gol ficou entalado na garganta de milhões de torcedores!',
  },
  {
    badge: 'POR UM FIO DE CABELO!',
    phrase: 'O goleiro já estava batido rezando pra santa! Faltou um sopro pra entrar!',
  },
];

const NEAR_JARGONS: JargonOption[] = [
  {
    badge: 'TIRANDO TINTA DA TRAVE!',
    phrase: 'Chutou raspando o poste! Faltou muito pouco pro título brasileiro ser garantido.',
  },
  {
    badge: 'PASSOU TIRANDO FUMAÇA!',
    phrase: 'A finalização foi quente demais, tirou faísca do ângulo!',
  },
  {
    badge: 'TROMBOU NA ZAGA!',
    phrase: 'A jogada foi envolvente, mas um desvio salvador tirou o gol do campeonato!',
  },
  {
    badge: 'QUASE O GOL DO TÍTULO!',
    phrase: 'A jogada foi ensaiada de calcanhar, faltou só o arremate final de bico!',
  },
];

const MEDIUM_JARGONS: JargonOption[] = [
  {
    badge: 'PEGOU NA ORELHA DA BOLA!',
    phrase: 'Pegou mascado na bola! A intenção foi de craque, mas o chute saiu meio torto.',
  },
  {
    badge: 'ESCORREGOU NO GRAMADO!',
    phrase: 'Faltou chuteira de trava alta! A bola subiu e não desceu a tempo pro abraço.',
  },
  {
    badge: 'ACERTOU A REDE POR FORA!',
    phrase: 'Metade do estádio gritou gol e a outra metade levou as mãos à cabeça!',
  },
  {
    badge: 'CHUTE DE CANELA!',
    phrase: 'Faltou calibrar o pé bom! A bola até que foi com raiva, mas longe da gaveta.',
  },
];

const FAR_JARGONS: JargonOption[] = [
  {
    badge: 'CHUTOU NA ARQUIBANCADA!',
    phrase: 'Mandou lá na praça da Sé! Isolou a bola do estádio e acertou o carrinho de pipoca!',
  },
  {
    badge: 'ISOLOU A BOLA!',
    phrase: 'Essa bola vai precisar de autorização da torre de controle do aeroporto pra descer!',
  },
  {
    badge: 'BICO PRO MATO!',
    phrase: 'O chute foi tão longe que a bola foi parar no estacionamento do Pacaembu!',
  },
  {
    badge: 'FOI COBRAR LATERAL!',
    phrase: 'Mirou na baliza e acertou a bandeirinha de escanteio do outro lado do campo!',
  },
  {
    badge: 'DESCALIBROU O CANHÃO!',
    phrase: 'Essa bola nem se chamar o guincho consegue resgatar! Recomeça tudo do zero!',
  },
];

export function getFootballJargon(
  totalGoals: number,
  targetGoals: number,
  mode: GameMode
): FootballJargon {
  const diff = Math.abs(totalGoals - targetGoals);

  // Exact target
  if (totalGoals === targetGoals) {
    const pick = EXACT_JARGONS[Math.floor(Math.random() * EXACT_JARGONS.length)];
    return {
      badge: pick.badge,
      phrase: pick.phrase,
      tone: 'exact',
    };
  }

  // Legend mode: exceeded target
  if (mode === 'LEGEND' && totalGoals > targetGoals) {
    const over = totalGoals - targetGoals;
    const pool = over <= 10 ? OVER_CLOSE_JARGONS : OVER_FAR_JARGONS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return {
      badge: pick.badge,
      phrase: `${pick.phrase} (${over} gol${over > 1 ? 's' : ''} além de 433)`,
      tone: 'over',
    };
  }

  // Under target or classic mode
  if (diff <= 5) {
    const pick = CLOSE_JARGONS[Math.floor(Math.random() * CLOSE_JARGONS.length)];
    return {
      badge: pick.badge,
      phrase: pick.phrase,
      tone: 'close',
    };
  }

  if (diff <= 25) {
    const pick = NEAR_JARGONS[Math.floor(Math.random() * NEAR_JARGONS.length)];
    return {
      badge: pick.badge,
      phrase: pick.phrase,
      tone: 'near',
    };
  }

  if (diff <= 65) {
    const pick = MEDIUM_JARGONS[Math.floor(Math.random() * MEDIUM_JARGONS.length)];
    return {
      badge: pick.badge,
      phrase: pick.phrase,
      tone: 'medium',
    };
  }

  // Distant from target (> 65)
  const pick = FAR_JARGONS[Math.floor(Math.random() * FAR_JARGONS.length)];
  return {
    badge: pick.badge,
    phrase: pick.phrase,
    tone: 'far',
  };
}
