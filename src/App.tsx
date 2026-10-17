import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { SquadBoard } from './components/SquadBoard';
import { DraftCards } from './components/DraftCards';
import { ResultStage } from './components/ResultStage';
import { GoalsMeter } from './components/GoalsMeter';
import { TacticalPitch } from './components/TacticalPitch';
import { AchievementsModal } from './components/AchievementsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HistoryModal } from './components/HistoryModal';
import { RankingsModal } from './components/RankingsModal';
import { UserAuthModal } from './components/UserAuthModal';
import { Toast } from './components/Toast';

import { FORMATIONS } from './data/formations';
import { Achievement, FormationType, GameMode, MatchHistoryItem, PitchSlot, Player, RankingEntry, SpecialCard, UserProfile } from './types/game';
import { assignPlayerToFirstOpenSlot, generateDraftRound, DraftOption } from './utils/draft';
import { checkAndUnlockAchievements, getAchievements } from './utils/achievements';
import { soundFx } from './utils/audio';
import { addMatchToHistory, getMatchHistory, getRankings, fetchLiveRankings, saveRankingEntry } from './utils/rankings';
import { getStoredUserProfile } from './utils/user';
import { SpecialCardsBanner } from './components/SpecialCardsBanner';
import { SubstitutionModal } from './components/SubstitutionModal';
import { generateRoundSpecialCards, getRandomSpecialCard } from './utils/specialCards';

const STADIUM_BG_IMAGE = '/src/assets/images/brasileirao_stadium_pitch_1792116638755.jpg';

export default function App() {
  const [formation, setFormation] = useState<FormationType>('4-3-3');
  const [mode, setMode] = useState<GameMode>('CLASSIC');
  const [targetGoals] = useState<number>(433);

  // Dark Mode State:
  // false = Modo Claro (Design Antigo: Estádio, Gramado Tático, Verde & Amarelo)
  // true = Modo Escuro (Design Atual: Editorial Poster, "ONZE NOMES. UM ALVO.", SEU XI)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('brasileirao_theme');
    if (saved) return saved === 'dark';
    return true; // Default to the current dark editorial design
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('brasileirao_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('brasileirao_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // User Profile
  const [user, setUser] = useState<UserProfile>(getStoredUserProfile);

  // History & Live Rankings
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>(getMatchHistory);
  const [rankings, setRankings] = useState<RankingEntry[]>(getRankings);

  // Sound Mute State
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  // Tactical Pitch Slots
  const [slots, setSlots] = useState<PitchSlot[]>(() => {
    return FORMATIONS['4-3-3'].slots.map(s => ({ ...s, player: null }));
  });

  const [draftedPlayerIds, setDraftedPlayerIds] = useState<Set<string>>(new Set());
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [rerollsLeft, setRerollsLeft] = useState<number>(2);

  // 3 Current Draft Options
  const [draftOptions, setDraftOptions] = useState<DraftOption[]>([]);
  const [isMatchOver, setIsMatchOver] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Special Card Mechanic: Only ONE card may be chosen per game!
  // "Em uma das rodadas, aleatoriamente, uma das cartas aparece em vez de um dos atletas da rodada"
  // "assim o jogador pode ficar em um dilema se escolhe um atleta ou escolhe a carta que pode ajudar ele futuramente"
  // "Depois de escolhida, a carta vira um botão que só terá o efeito válido depois de clicado"
  // Guaranteed to appear in every single game (between rounds 2 and 5 for early/mid tactical dilemma)
  const [specialCardRound, setSpecialCardRound] = useState<number>(() => {
    return Math.floor(Math.random() * 4) + 2; // Rounds 2, 3, 4, or 5
  });
  const [hasPassedSpecialCard, setHasPassedSpecialCard] = useState<boolean>(false);
  const [chosenSpecialCard, setChosenSpecialCard] = useState<SpecialCard | null>(null);
  const [isSpecialCardUsed, setIsSpecialCardUsed] = useState<boolean>(false);
  const [roundSpecialCards, setRoundSpecialCards] = useState<SpecialCard[]>([]);
  const [isPeekActive, setIsPeekActive] = useState<boolean>(false);
  const [activeMultiplier, setActiveMultiplier] = useState<number>(1);
  const [bonusGoals, setBonusGoals] = useState<number>(0);
  const [isSubstitutionOpen, setIsSubstitutionOpen] = useState<boolean>(false);

  // Modals & Notifications
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isRankingsOpen, setIsRankingsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [achievements, setAchievements] = useState<Achievement[]>(getAchievements);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);

  // Fetch live server rankings on mount
  useEffect(() => {
    fetchLiveRankings().then(liveData => {
      if (liveData && liveData.length > 0) {
        setRankings(liveData);
      }
    });
  }, []);

  const handleRefreshRankings = useCallback(() => {
    fetchLiveRankings().then(liveData => {
      if (liveData) setRankings(liveData);
    });
  }, []);

  // Total Goals Calculation (Slots Goals + Special Card Bonus/Discount)
  const totalGoals = useMemo(() => {
    const slotGoals = slots.reduce((acc, slot) => acc + (slot.player?.goals || 0), 0);
    return Math.max(0, slotGoals + bonusGoals);
  }, [slots, bonusGoals]);

  const draftedCount = useMemo(() => {
    return slots.filter(s => s.player !== null).length;
  }, [slots]);

  const legendaryCount = useMemo(() => {
    return slots.filter(s => s.player?.isLegendary).length;
  }, [slots]);

  const canChangeSetup = draftedCount === 0;

  // Refresh draft round options based on remaining open positions and random special card round
  const refreshDraftOptions = useCallback(
    (
      currentSlotsState: PitchSlot[],
      draftedIds: Set<string>,
      currentFormation: FormationType,
      roundToUse = currentRound,
      overrideSpecialRound = specialCardRound,
      overrideChosenCard = chosenSpecialCard,
      overridePassed = hasPassedSpecialCard
    ) => {
      const formConfig = FORMATIONS[currentFormation];
      const shouldInjectSpecialCard =
        roundToUse === overrideSpecialRound &&
        overrideChosenCard === null &&
        !overridePassed;

      let specialCardToInject: SpecialCard | null = null;
      if (shouldInjectSpecialCard) {
        const slotGoals = currentSlotsState.reduce((acc, s) => acc + (s.player?.goals || 0), 0);
        const currentDrafted = currentSlotsState.filter(s => s.player !== null).length;
        specialCardToInject = getRandomSpecialCard(roundToUse, currentDrafted, slotGoals + bonusGoals, mode);
      }

      const newOptions = generateDraftRound(
        formConfig,
        currentSlotsState,
        draftedIds,
        specialCardToInject
      );
      setDraftOptions(newOptions);
    },
    [currentRound, specialCardRound, chosenSpecialCard, hasPassedSpecialCard, bonusGoals, mode]
  );

  // Update round special cards if player has not yet chosen their 1 card for the game
  useEffect(() => {
    if (chosenSpecialCard === null && !isMatchOver) {
      const cards = generateRoundSpecialCards(currentRound, draftedCount, totalGoals, mode);
      setRoundSpecialCards(cards);
    }
  }, [currentRound, chosenSpecialCard, isMatchOver]);

  // On first load or restart
  useEffect(() => {
    refreshDraftOptions(slots, draftedPlayerIds, formation);
  }, []);

  const handleToggleMute = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleRestart = (newFormation = formation, newMode = mode) => {
    soundFx.playWhistle();
    const initialSlots = FORMATIONS[newFormation].slots.map(s => ({ ...s, player: null }));
    setSlots(initialSlots);
    setDraftedPlayerIds(new Set());
    setCurrentRound(1);
    setRerollsLeft(2);
    setIsMatchOver(false);

    // Reset special card state for the new game: guaranteed between rounds 2 and 5
    const newSpecialRound = Math.floor(Math.random() * 4) + 2; // e.g. 2, 3, 4, or 5
    setSpecialCardRound(newSpecialRound);
    setHasPassedSpecialCard(false);
    setChosenSpecialCard(null);
    setIsSpecialCardUsed(false);
    setIsPeekActive(false);
    setActiveMultiplier(1);
    setBonusGoals(0);
    setIsSubstitutionOpen(false);

    refreshDraftOptions(initialSlots, new Set(), newFormation, 1, newSpecialRound, null, false);
  };

  const handleChangeFormation = (newForm: FormationType) => {
    if (newForm === formation) return;
    setFormation(newForm);
    handleRestart(newForm, mode);
  };

  const handleChangeMode = (newMode: GameMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    handleRestart(formation, newMode);
  };

  const handleReroll = () => {
    if (rerollsLeft <= 0 || isMatchOver) return;
    setRerollsLeft(prev => prev - 1);
    refreshDraftOptions(
      slots,
      draftedPlayerIds,
      formation,
      currentRound,
      specialCardRound,
      chosenSpecialCard,
      hasPassedSpecialCard
    );
  };

  // User chooses their 1 special card for the match
  const handleChooseSpecialCard = (card: SpecialCard) => {
    if (chosenSpecialCard !== null) return; // Strict limit: 1 card per game!
    setChosenSpecialCard(card);
    setIsSpecialCardUsed(false);
  };

  // User selects the Special Card directly from the draft options!
  // "assim o jogador pode ficar em um dilema se escolhe um atleta ou escolhe a carta que pode ajudar ele futuramente"
  // "Depois de escolhida, a carta vira um botão que só terá o efeito válido depois de clicado"
  const handleSelectSpecialCard = (card: SpecialCard, basePlayer: Player) => {
    if (chosenSpecialCard !== null) return; // Strict limit: 1 card per game!

    setChosenSpecialCard(card);
    setIsSpecialCardUsed(false);
    soundFx.playSpecialCardPick();

    // The Cria da Base player fills the squad slot for that position
    const updatedSlots = assignPlayerToFirstOpenSlot(basePlayer, slots);
    setSlots(updatedSlots);

    const nextDraftedIds = new Set(draftedPlayerIds);
    nextDraftedIds.add(basePlayer.id);
    setDraftedPlayerIds(nextDraftedIds);

    const slotGoals = updatedSlots.reduce((acc, s) => acc + (s.player?.goals || 0), 0);
    const newTotalGoals = Math.max(0, slotGoals + bonusGoals);
    const draftedPlayers = updatedSlots.filter(s => s.player !== null).map(s => s.player!);

    const updatedAchievements = checkAndUnlockAchievements(
      draftedPlayers,
      newTotalGoals,
      mode,
      formation,
      newlyUnlocked => {
        setActiveToast(newlyUnlocked);
        soundFx.playVictoryFanfare();
      }
    );
    setAchievements(updatedAchievements);

    if (currentRound >= 11) {
      setIsMatchOver(true);
      const updatedHistory = addMatchToHistory(updatedSlots, newTotalGoals, mode, formation);
      setMatchHistory(updatedHistory);
      saveRankingEntry(user, newTotalGoals, mode, formation);
      setTimeout(() => {
        handleRefreshRankings();
      }, 300);

      const isWon =
        mode === 'CLASSIC' ? newTotalGoals >= targetGoals : newTotalGoals === targetGoals;

      if (isWon) {
        soundFx.playVictoryFanfare();
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.5 },
          colors: ['#476657', '#CB6D53', '#DFA024', '#FFFFFF'],
        });
      } else {
        soundFx.playWhistle();
      }
    } else {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      refreshDraftOptions(
        updatedSlots,
        nextDraftedIds,
        formation,
        nextRound,
        specialCardRound,
        card,
        hasPassedSpecialCard
      );
    }
  };

  // User clicks the transformed button to activate the chosen card effect
  // "Depois de escolhida, a carta vira um botão que só terá o efeito válido depois de clicado"
  const handleActivateSpecialCard = () => {
    if (!chosenSpecialCard || isSpecialCardUsed) return;

    switch (chosenSpecialCard.type) {
      case 'PEEK_GOALS':
        setIsPeekActive(true);
        setIsSpecialCardUsed(true);
        break;
      case 'SUBSTITUTE_PLAYER':
        setIsSubstitutionOpen(true);
        break;
      case 'DOUBLE_GOALS':
        setActiveMultiplier(2);
        setIsSpecialCardUsed(true);
        break;
      case 'FINE_TUNE_MINUS':
        setBonusGoals(prev => prev - 10);
        setIsSpecialCardUsed(true);
        break;
      case 'FINE_TUNE_PLUS':
        setBonusGoals(prev => prev + 10);
        setIsSpecialCardUsed(true);
        break;
      case 'EXTRA_REROLLS':
        setRerollsLeft(prev => prev + 2);
        setIsSpecialCardUsed(true);
        break;
    }
  };

  // Substitution execution
  const handleConfirmSubstitution = (oldSlotId: string, newPlayer: Player) => {
    const oldSlot = slots.find(s => s.id === oldSlotId);
    if (!oldSlot || !oldSlot.player) return;

    const oldPlayerId = oldSlot.player.id;
    const updatedSlots = slots.map(s => {
      if (s.id === oldSlotId) {
        return { ...s, player: newPlayer };
      }
      return s;
    });

    setSlots(updatedSlots);

    const nextDraftedIds = new Set(draftedPlayerIds);
    nextDraftedIds.delete(oldPlayerId);
    nextDraftedIds.add(newPlayer.id);
    setDraftedPlayerIds(nextDraftedIds);

    // Recalculate achievements on substitution
    const slotGoals = updatedSlots.reduce((acc, s) => acc + (s.player?.goals || 0), 0);
    const newTotalGoals = Math.max(0, slotGoals + bonusGoals);
    const draftedPlayers = updatedSlots.filter(s => s.player !== null).map(s => s.player!);
    const updatedAchievements = checkAndUnlockAchievements(
      draftedPlayers,
      newTotalGoals,
      mode,
      formation,
      newlyUnlocked => {
        setActiveToast(newlyUnlocked);
        soundFx.playVictoryFanfare();
      }
    );
    setAchievements(updatedAchievements);

    // Mark card as successfully used
    setIsSpecialCardUsed(true);
  };

  const handleSelectPlayer = (player: Player) => {
    // If special card was offered in this round and player picked an athlete, the card is passed
    const didPassThisRound = currentRound === specialCardRound && chosenSpecialCard === null;
    if (didPassThisRound) {
      setHasPassedSpecialCard(true);
    }

    // If activeMultiplier is 2 (Lei do Ex), double this player's goals!
    const effectivePlayer: Player =
      activeMultiplier === 2
        ? {
            ...player,
            goals: player.goals * 2,
            highlight: `${player.highlight} (Gols dobrados 2x pela Lei do Ex!)`,
          }
        : player;

    setActiveMultiplier(1);
    setIsPeekActive(false);

    // 1. Assign player to first available slot matching position
    const updatedSlots = assignPlayerToFirstOpenSlot(effectivePlayer, slots);
    setSlots(updatedSlots);

    // 2. Mark player as drafted
    const nextDraftedIds = new Set(draftedPlayerIds);
    nextDraftedIds.add(player.id);
    setDraftedPlayerIds(nextDraftedIds);

    // 3. Calculate new total goals including bonusGoals
    const slotGoals = updatedSlots.reduce((acc, s) => acc + (s.player?.goals || 0), 0);
    const newTotalGoals = Math.max(0, slotGoals + bonusGoals);
    const draftedPlayers = updatedSlots.filter(s => s.player !== null).map(s => s.player!);

    // 4. Check achievements
    const updatedAchievements = checkAndUnlockAchievements(
      draftedPlayers,
      newTotalGoals,
      mode,
      formation,
      newlyUnlocked => {
        setActiveToast(newlyUnlocked);
        soundFx.playVictoryFanfare();
      }
    );
    setAchievements(updatedAchievements);

    // 5. Check if squad is complete (11 picks)
    if (currentRound >= 11) {
      setIsMatchOver(true);

      // Save to last 5 match attempts history
      const updatedHistory = addMatchToHistory(updatedSlots, newTotalGoals, mode, formation);
      setMatchHistory(updatedHistory);

      // Submit score to live real rankings
      saveRankingEntry(user, newTotalGoals, mode, formation);
      setTimeout(() => {
        handleRefreshRankings();
      }, 300);

      const isWon =
        mode === 'CLASSIC' ? newTotalGoals >= targetGoals : newTotalGoals === targetGoals;

      if (isWon) {
        soundFx.playVictoryFanfare();
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.5 },
          colors: ['#476657', '#CB6D53', '#DFA024', '#FFFFFF'],
        });
      } else {
        soundFx.playWhistle();
      }
    } else {
      // Advance to next round and generate 3 fresh options from remaining open positions
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      const willHavePassed = hasPassedSpecialCard || didPassThisRound;
      refreshDraftOptions(
        updatedSlots,
        nextDraftedIds,
        formation,
        nextRound,
        specialCardRound,
        chosenSpecialCard,
        willHavePassed
      );
    }
  };

  const handleShare = () => {
    const playerLines = slots
      .filter(s => s.player)
      .map(s => `${s.position}: ${s.player!.name} (${s.player!.goals} gols)`)
      .join('\n');

    const resultText = `⚽ Brasileirão 433 - ONZE NOMES. UM ALVO.\n` +
      `Técnico: ${user.nickname} | Esquema: ${formation}\n` +
      `Gols na Conta: ${totalGoals} / ${targetGoals} (${totalGoals === 433 ? '🏆 433 CRAVADOS!' : 'Finalizado'})\n\n` +
      `Meu Esquadrão:\n${playerLines}\n\n` +
      `Conhece a história do Brasileirão? Jogue agora!`;

    navigator.clipboard.writeText(resultText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors relative ${
      isDarkMode
        ? 'bg-[#0c1510] text-[#e5ede8] selection:bg-[#cb6d53] selection:text-white'
        : 'bg-[#07190f] text-slate-100 selection:bg-yellow-400 selection:text-slate-950'
    }`}>
      {/* Stadium Background Atmosphere in Modo Claro (Design Antigo) */}
      {!isDarkMode && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <img
            src={STADIUM_BG_IMAGE}
            alt="Estádio do Brasileirão"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07170e]/90 via-[#05130b]/95 to-[#040e08]" />
        </div>
      )}

      {/* Top Header */}
      <Header
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenRankings={() => setIsRankingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onRestart={() => handleRestart(formation, mode)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        user={user}
        unlockedAchievementsCount={unlockedAchievementsCount}
        totalAchievementsCount={achievements.length}
      />

      {/* ============================================================== */}
      {/* MODO CLARO: DESIGN ANTIGO (ESTÁDIO, VERDE E AMARELO, CAMPO TÁTICO) */}
      {/* ============================================================== */}
      {!isDarkMode ? (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 z-10 flex flex-col gap-6 flex-1">
          {/* Stadium Goals Scoreboard HUD */}
          <GoalsMeter
            totalGoals={totalGoals}
            targetGoals={targetGoals}
            draftedCount={draftedCount}
            totalPicks={11}
            legendaryCount={legendaryCount}
            mode={mode}
            formation={formation}
            onChangeMode={handleChangeMode}
            onChangeFormation={handleChangeFormation}
            canChangeSetup={canChangeSetup}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Draft Selection or Victory Card */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {!isMatchOver ? (
                <>
                  {/* Special Cards: Max 1 chosen per game. Turns into an action button! */}
                  <SpecialCardsBanner
                    availableCards={roundSpecialCards}
                    chosenCard={chosenSpecialCard}
                    isUsed={isSpecialCardUsed}
                    onChooseCard={handleChooseSpecialCard}
                    onActivateCard={handleActivateSpecialCard}
                    isPeekActive={isPeekActive}
                    activeMultiplier={activeMultiplier}
                    draftedCount={draftedCount}
                  />

                  <DraftCards
                    options={draftOptions}
                    onSelectPlayer={handleSelectPlayer}
                    onSelectSpecialCard={handleSelectSpecialCard}
                    onReroll={handleReroll}
                    rerollsLeft={rerollsLeft}
                    currentRound={currentRound}
                    totalRounds={11}
                    isPeekActive={isPeekActive}
                    activeMultiplier={activeMultiplier}
                  />
                </>
              ) : (
                <ResultStage
                  totalGoals={totalGoals}
                  targetGoals={targetGoals}
                  mode={mode}
                  onRestart={() => handleRestart(formation, mode)}
                  onShare={handleShare}
                  isCopied={isCopied}
                  onOpenRankings={() => setIsRankingsOpen(true)}
                />
              )}

              {/* Quick rules banner */}
              <div className="p-4 rounded-xl bg-black/40 border border-emerald-900/40 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
                  <span>
                    <strong>Design Estádio (Modo Claro):</strong> Formações com prancheta tática real e gramado iluminado.
                  </span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="text-yellow-400 hover:underline font-semibold cursor-pointer shrink-0"
                >
                  Alternar para Design Editorial →
                </button>
              </div>
            </div>

            {/* Right: The Interactive Green Football Pitch */}
            <div className="lg:col-span-5 w-full">
              <TacticalPitch
                slots={slots}
                formationName={FORMATIONS[formation].name}
              />
            </div>
          </div>
        </main>
      ) : (
        /* ============================================================== */
        /* MODO ESCURO: DESIGN ATUAL (EDITORIAL POSTER, ONZE NOMES. UM ALVO.) */
        /* ============================================================== */
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 flex-1 z-10">
          {/* Editorial Hero Header matching user reference */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#203328] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8ea598] mb-2">
                <span className="w-5 h-0.5 bg-[#cb6d53]" />
                <span>A ESCALAÇÃO DEFINITIVA</span>
              </div>

              <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.88] uppercase select-none">
                <span className="block text-[#8cc4a1]">ONZE NOMES.</span>
                <span className="block text-[#cb6d53]">UM ALVO.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#90a699] max-w-xl mt-4 leading-relaxed font-medium">
                Conhece a história do Brasileirão? Prove no gramado: escolha um craque por rodada e monte um XI que chegue aos 433 gols.
              </p>
            </div>

            {/* Configuration Controls: Mode & Formation */}
            <div className="flex flex-col gap-3">
              {/* Mode Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-[#192b21] rounded-lg self-start md:self-end">
                <button
                  onClick={() => handleChangeMode('CLASSIC')}
                  className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    mode === 'CLASSIC'
                      ? 'bg-[#274433] text-white shadow-xs'
                      : 'text-[#8ca597] hover:text-white'
                  }`}
                >
                  Clássico (433+)
                </button>
                <button
                  onClick={() => handleChangeMode('LEGEND')}
                  className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    mode === 'LEGEND'
                      ? 'bg-[#cb6d53] text-white shadow-xs'
                      : 'text-[#8ca597] hover:text-white'
                  }`}
                >
                  Modo Lenda (433 Exato)
                </button>
              </div>

              {/* Formation Selector */}
              <div className="flex items-center gap-2 self-start md:self-end text-xs font-semibold text-[#8ca597]">
                <span>Formação:</span>
                <div className="flex items-center gap-1 p-1 bg-[#192b21] rounded-lg">
                  {(['4-3-3', '4-4-2', '4-5-1', '3-5-2', '3-4-3'] as FormationType[]).map(form => (
                    <button
                      key={form}
                      onClick={() => handleChangeFormation(form)}
                      className={`px-2.5 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
                        formation === form
                          ? 'bg-[#274433] text-white shadow-xs'
                          : 'text-[#8ca597] hover:text-white'
                      }`}
                    >
                      {form}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column Main Layout: Left = Action / Result Stage, Right = SEU XI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (Lg: 7 cols): Active Draft Cards or Completed Match Screen */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {!isMatchOver ? (
                <>
                  {/* Special Cards: Max 1 chosen per game. Turns into an action button! */}
                  <SpecialCardsBanner
                    availableCards={roundSpecialCards}
                    chosenCard={chosenSpecialCard}
                    isUsed={isSpecialCardUsed}
                    onChooseCard={handleChooseSpecialCard}
                    onActivateCard={handleActivateSpecialCard}
                    isPeekActive={isPeekActive}
                    activeMultiplier={activeMultiplier}
                    draftedCount={draftedCount}
                  />

                  <DraftCards
                    options={draftOptions}
                    onSelectPlayer={handleSelectPlayer}
                    onSelectSpecialCard={handleSelectSpecialCard}
                    onReroll={handleReroll}
                    rerollsLeft={rerollsLeft}
                    currentRound={currentRound}
                    totalRounds={11}
                    isPeekActive={isPeekActive}
                    activeMultiplier={activeMultiplier}
                  />
                </>
              ) : (
                <ResultStage
                  totalGoals={totalGoals}
                  targetGoals={targetGoals}
                  mode={mode}
                  onRestart={() => handleRestart(formation, mode)}
                  onShare={handleShare}
                  isCopied={isCopied}
                  onOpenRankings={() => setIsRankingsOpen(true)}
                />
              )}
            </div>

            {/* Right Column (Lg: 5 cols): SEU XI Board matching screenshot */}
            <div className="lg:col-span-5">
              <SquadBoard
                slots={slots}
                formation={formation}
                totalGoals={totalGoals}
                targetGoals={targetGoals}
                mode={mode}
              />
            </div>
          </div>
        </main>
      )}

      {/* History Modal (Last 5 attempts) */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={matchHistory}
      />

      {/* Daily Rankings Modal */}
      <RankingsModal
        isOpen={isRankingsOpen}
        onClose={() => setIsRankingsOpen(false)}
        rankings={rankings}
        user={user}
        onOpenProfile={() => {
          setIsRankingsOpen(false);
          setIsProfileOpen(true);
        }}
        onRefresh={handleRefreshRankings}
      />

      {/* User Profile / Nickname / Google Login Modal */}
      <UserAuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={updated => {
          setUser(updated);
          handleRefreshRankings();
        }}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Substitution Tactical Modal */}
      <SubstitutionModal
        isOpen={isSubstitutionOpen}
        onClose={() => setIsSubstitutionOpen(false)}
        slots={slots}
        draftedPlayerIds={draftedPlayerIds}
        onConfirmSubstitution={handleConfirmSubstitution}
      />

      {/* Toast Notification */}
      <Toast
        achievement={activeToast}
        onClose={() => setActiveToast(null)}
      />

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-[#dedbd2] dark:border-[#203328] text-center text-xs text-[#78887e] dark:text-[#6a8074]">
        Brasileirão 433 · Inspirado nos maiores goleadores dos pontos corridos
      </footer>
    </div>
  );
}
