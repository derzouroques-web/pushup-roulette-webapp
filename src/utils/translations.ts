export type Language = 'en' | 'zh' | 'fr';

export interface Translations {
  // Header & Nav
  appTitle1: string;
  appTitle2: string;
  appSubtitle: string;
  tabGame: string;
  tabHistory: string;
  tabStats: string;
  restTimerTooltip: string;
  soundToggleTooltip: string;
  settingsTooltip: string;
  languageSelect: string;

  // Turn Callout & Game
  currentSpinner: string;
  totalPushupsLogged: string;
  spinWheel: string;
  spinning: string;
  allEliminatedAlert: string;

  // Side Bet Selector
  riskReward: string;
  betActive: string;
  betNoneSubtitle: string;
  betRedSubtitle: string;
  betBlackSubtitle: string;
  betOddSubtitle: string;
  betEvenSubtitle: string;

  // Betting Board
  boardTitle: string;
  eliminationModeOn: string;
  eliminationModeOff: string;
  eliminatedCount: string;
  resetPool: string;
  lastLanded: string;
  redNumbers: string;
  blackNumbers: string;
  greenZero: string;

  // Player Manager
  playersLeaderboard: string;
  addPlayer: string;
  playerNamePlaceholder: string;
  selectAvatar: string;
  totalReps: string;
  completedReps: string;
  maxSingle: string;
  streak: string;
  active: string;
  switchPlayer: string;
  removePlayer: string;
  cancel: string;
  savePlayer: string;

  // Spin Modal
  playerResult: string;
  greenZeroPocket: string;
  redPocket: string;
  blackPocket: string;
  targetPushups: string;
  calculationBreakdown: string;
  zeroBonusTitle: string;
  zeroBonusDesc: string;
  completeReps: string;
  partialReps: string;
  passTurn: string;
  startRestTimer: string;
  customAmount: string;
  saveCustom: string;

  // Game Settings Modal
  gameRulesSettings: string;
  eliminationModeTitle: string;
  eliminationModeDesc: string;
  repCapTitle: string;
  repCapDesc: string;
  uncapped: string;
  defaultRestTime: string;
  seconds: string;
  soundEffects: string;
  soundEffectsDesc: string;
  autoAdvance: string;
  autoAdvanceDesc: string;
  zeroRestBonus: string;
  zeroRestBonusDesc: string;
  closeSettings: string;

  // History Log
  historyTitle: string;
  noHistory: string;
  player: string;
  numberLanded: string;
  targetReps: string;
  repsDone: string;
  status: string;
  sideBet: string;
  time: string;
  completed: string;
  partial: string;
  passed: string;

  // Stats Dashboard
  analyticsTitle: string;
  totalPushupsOverall: string;
  totalSpinsOverall: string;
  avgPushupsPerSpin: string;
  leaderboard: string;
  pushupsDistribution: string;

  // Rest Timer
  restTimer: string;
  timeRemaining: string;
  add30s: string;
  pause: string;
  resume: string;
  skip: string;

  // Welcome & Setup Modal
  welcomeTitle: string;
  welcomeSubtitle: string;
  playerCountLabel: string;
  pushupsUnit: string;
  perPlayer: string;
  targetGoalLabel: string;
  startGameBtn: string;
  changeGameSetup: string;
  goalAchievedTitle: string;
  goalAchievedDesc: string;
  continueWorkout: string;
  newGame: string;
  quickRemoveHalf: string;
  onboardingWelcome: string;
  activeWorkoutMode: string;
  workoutObjective: string;
  targetGoalProgress: string;
  boardClearanceProgress: string;
  pocketsCleared: string;
  repsRemaining: string;
  goalReached: string;
  boardCompleted: string;
  poolRepsRemaining: string;
  spinGoalPreview: string;
  spinGoalReachedPreview: string;
  sessionStats: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header & Nav
    appTitle1: 'ROULETTE',
    appTitle2: 'PUSHUP',
    appSubtitle: 'Casino Fitness Challenge',
    tabGame: 'Push Up Game',
    tabHistory: 'History',
    tabStats: 'Analytics',
    restTimerTooltip: 'Rest Timer',
    soundToggleTooltip: 'Toggle Audio FX',
    settingsTooltip: 'Game Rules & Settings',
    languageSelect: 'Language',

    // Turn Callout & Game
    currentSpinner: 'Current Spinner',
    totalPushupsLogged: 'total pushups logged',
    spinWheel: 'Spin Wheel 🎲',
    spinning: 'Spinning...',
    allEliminatedAlert: 'All numbers have been eliminated! Resetting wheel pool automatically.',

    // Side Bet Selector
    riskReward: 'Risk & Reward',
    betActive: 'BET ACTIVE',
    betNoneSubtitle: 'Standard 1x',
    betRedSubtitle: 'Red Pockets',
    betBlackSubtitle: 'Black Pockets',
    betOddSubtitle: 'Odd Numbers',
    betEvenSubtitle: 'Even Numbers',

    // Betting Board
    boardTitle: 'Roulette Board & History',
    eliminationModeOn: 'Elimination Mode ON',
    eliminationModeOff: 'Standard Pool (0-36)',
    eliminatedCount: 'Eliminated',
    resetPool: 'Reset Wheel Pool',
    lastLanded: 'Last Landed',
    redNumbers: 'Red Pockets',
    blackNumbers: 'Black Pockets',
    greenZero: 'Green Zero',

    // Player Manager
    playersLeaderboard: 'Players & Leaderboard',
    addPlayer: 'Add Player',
    playerNamePlaceholder: 'Player Name',
    selectAvatar: 'Select Avatar',
    totalReps: 'Total Reps',
    completedReps: 'Completed',
    maxSingle: 'Max Single',
    streak: 'Streak',
    active: 'Active',
    switchPlayer: 'Switch Turn',
    removePlayer: 'Remove',
    cancel: 'Cancel',
    savePlayer: 'Save Player',

    // Spin Modal
    playerResult: "{name}'s Result",
    greenZeroPocket: 'Green Zero',
    redPocket: 'Red Pocket',
    blackPocket: 'Black Pocket',
    targetPushups: 'Target Pushups',
    calculationBreakdown: 'Calculation Breakdown',
    zeroBonusTitle: '🎉 Rest Bonus!',
    zeroBonusDesc: 'Zero landed! Take a break.',
    completeReps: 'Complete {count} Reps',
    partialReps: 'Log Partial Reps',
    passTurn: 'Pass Turn (0 reps)',
    startRestTimer: 'Start Rest Timer ({seconds}s)',
    customAmount: 'Custom Reps Amount',
    saveCustom: 'Save Partial',

    // Game Settings Modal
    gameRulesSettings: 'Game Rules & Settings',
    eliminationModeTitle: 'Elimination Mode',
    eliminationModeDesc: 'Landed numbers are removed from the wheel pool until all 37 are hit.',
    repCapTitle: 'Max Pushup Cap',
    repCapDesc: 'Cap single spin pushups (0 = uncapped).',
    uncapped: 'Uncapped',
    defaultRestTime: 'Default Rest Timer',
    seconds: 'seconds',
    soundEffects: 'Audio Sound Effects',
    soundEffectsDesc: 'Wheel spin sounds and win fanfare.',
    autoAdvance: 'Auto-Advance Turn',
    autoAdvanceDesc: 'Automatically switch turn to next player after logging reps.',
    zeroRestBonus: 'Zero Rest Bonus Rule',
    zeroRestBonusDesc: 'Landing on 0 rewards player with 2 minutes rest time.',
    closeSettings: 'Close Settings',

    // History Log
    historyTitle: 'Spin History & Logs',
    noHistory: 'No spins logged yet. Spin the wheel to start playing!',
    player: 'Player',
    numberLanded: 'Number',
    targetReps: 'Target',
    repsDone: 'Done',
    status: 'Status',
    sideBet: 'Side Bet',
    time: 'Time',
    completed: 'Completed',
    partial: 'Partial',
    passed: 'Passed',

    // Stats Dashboard
    analyticsTitle: 'Player Analytics & Performance',
    totalPushupsOverall: 'Total Pushups Completed',
    totalSpinsOverall: 'Total Wheel Spins',
    avgPushupsPerSpin: 'Avg Reps / Spin',
    leaderboard: 'Leaderboard Standings',
    pushupsDistribution: 'Spin Pocket Distribution',

    // Rest Timer
    restTimer: 'Rest & Recovery Timer',
    timeRemaining: 'Time Remaining',
    add30s: '+30 Seconds',
    pause: 'Pause',
    resume: 'Resume',
    skip: 'Skip Rest',

    // Welcome & Setup Modal
    welcomeTitle: 'Push-Up Roulette',
    welcomeSubtitle: 'How many players are joining the workout today?',
    playerCountLabel: 'Number of Players',
    pushupsUnit: 'pushups',
    perPlayer: 'player',
    targetGoalLabel: 'Total pushups today',
    startGameBtn: 'Start Workout 🚀',
    changeGameSetup: 'Setup / Mode',
    goalAchievedTitle: '🏆 Target Goal Achieved!',
    goalAchievedDesc: 'Outstanding work! You hit your workout target of {target} pushups!',
    continueWorkout: 'Keep Going',
    newGame: 'New Workout Session',
    quickRemoveHalf: 'Trim Half Board',
    onboardingWelcome: 'Daily Workout Setup',
    activeWorkoutMode: 'Active Mode',
    workoutObjective: 'Workout Objective',
    targetGoalProgress: 'Target Pushup Milestone',
    boardClearanceProgress: 'Roulette Board Clearance',
    pocketsCleared: '{cleared} of {total} pockets cleared',
    repsRemaining: '{count} reps remaining to goal',
    goalReached: 'Goal Reached! 🏆',
    boardCompleted: 'Board Cleared! 🎉',
    poolRepsRemaining: '{count} reps left in pool',
    spinGoalPreview: '+{reps} reps → {next} / {goal} ({percent}%)',
    spinGoalReachedPreview: '🎉 This spin completes your goal milestone!',
    sessionStats: 'Session Metrics',
  },

  zh: {
    // Header & Nav
    appTitle1: '輪盤',
    appTitle2: '俯臥撐',
    appSubtitle: '賭場健身挑戰賽',
    tabGame: '俯臥撐遊戲',
    tabHistory: '歷史記錄',
    tabStats: '數據分析',
    restTimerTooltip: '休息計時器',
    soundToggleTooltip: '開關音效',
    settingsTooltip: '遊戲規則與設置',
    languageSelect: '語言',

    // Turn Callout & Game
    currentSpinner: '當前玩家',
    totalPushupsLogged: '累計完成俯臥撐',
    spinWheel: '旋轉輪盤 🎲',
    spinning: '旋轉中...',
    allEliminatedAlert: '所有數字均已被淘汰！自動重置輪盤號碼池。',

    // Side Bet Selector
    riskReward: '高風險高回報',
    betActive: '邊注生效中',
    betNoneSubtitle: '標準 1x',
    betRedSubtitle: '紅槽數字',
    betBlackSubtitle: '黑槽數字',
    betOddSubtitle: '奇數數字',
    betEvenSubtitle: '偶數數字',

    // Betting Board
    boardTitle: '輪盤棋盤與歷史記錄',
    eliminationModeOn: '淘汰模式 已開啟',
    eliminationModeOff: '標準號碼池 (0-36)',
    eliminatedCount: '已淘汰',
    resetPool: '重置號碼池',
    lastLanded: '上輪轉出',
    redNumbers: '紅槽數字',
    blackNumbers: '黑槽數字',
    greenZero: '綠色零號',

    // Player Manager
    playersLeaderboard: '玩家與排行榜',
    addPlayer: '添加玩家',
    playerNamePlaceholder: '玩家姓名',
    selectAvatar: '選擇頭像',
    totalReps: '總次數',
    completedReps: '已完成',
    maxSingle: '單次最高',
    streak: '連勝',
    active: '當前',
    switchPlayer: '切換回合',
    removePlayer: '移除',
    cancel: '取消',
    savePlayer: '保存玩家',

    // Spin Modal
    playerResult: '{name} 的結果',
    greenZeroPocket: '綠色零號',
    redPocket: '紅槽',
    blackPocket: '黑槽',
    targetPushups: '目標俯臥撐',
    calculationBreakdown: '計算明細',
    zeroBonusTitle: '🎉 休息獎勵！',
    zeroBonusDesc: '轉中0號！獲得免費休息時間。',
    completeReps: '完成 {count} 次',
    partialReps: '記錄部分次數',
    passTurn: '放棄本輪 (0次)',
    startRestTimer: '開啟休息計時器 ({seconds}秒)',
    customAmount: '自定義次數',
    saveCustom: '保存部分次數',

    // Game Settings Modal
    gameRulesSettings: '遊戲規則與設置',
    eliminationModeTitle: '淘汰模式',
    eliminationModeDesc: '轉中的數字將被移除，直到37個數字全部被擊中。',
    repCapTitle: '單次最高上限',
    repCapDesc: '設置單次最多個數（0表示不上限）。',
    uncapped: '無上限',
    defaultRestTime: '默認休息時間',
    seconds: '秒',
    soundEffects: '音效開關',
    soundEffectsDesc: '輪盤旋轉聲和勝利音效。',
    autoAdvance: '自動切換回合',
    autoAdvanceDesc: '記錄次數後自動切換到下一位玩家。',
    zeroRestBonus: '零號休息獎勵規則',
    zeroRestBonusDesc: '轉中0號獎勵玩家2分鐘休息時間。',
    closeSettings: '關閉設置',

    // History Log
    historyTitle: '轉盤歷史與日誌',
    noHistory: '暫無記錄。旋轉輪盤開始遊戲吧！',
    player: '玩家',
    numberLanded: '轉出數字',
    targetReps: '目標',
    repsDone: '完成',
    status: '狀態',
    sideBet: '邊注',
    time: '時間',
    completed: '完全完成',
    partial: '部分完成',
    passed: '已放棄',

    // Stats Dashboard
    analyticsTitle: '玩家數據與表現',
    totalPushupsOverall: '累計完成俯臥撐',
    totalSpinsOverall: '累計旋轉次數',
    avgPushupsPerSpin: '平均每次個數',
    leaderboard: '排行榜名次',
    pushupsDistribution: '數字槽分布',

    // Rest Timer
    restTimer: '休息與恢復計時器',
    timeRemaining: '剩餘時間',
    add30s: '+30 秒',
    pause: '暫停',
    resume: '繼續',
    skip: '跳過休息',

    // Welcome & Setup Modal
    welcomeTitle: '俯臥撐輪盤',
    welcomeSubtitle: '今天有幾位玩家參與健身挑戰？',
    playerCountLabel: '玩家人數',
    pushupsUnit: '個俯臥撐',
    perPlayer: '每人',
    targetGoalLabel: '今天的俯臥撐總數',
    startGameBtn: '開始訓練 🚀',
    changeGameSetup: '模式設定',
    goalAchievedTitle: '🏆 目標達成！',
    goalAchievedDesc: '太棒了！您已成功完成 {target} 個俯臥撐的訓練目標！',
    continueWorkout: '繼續挑戰',
    newGame: '開始新回合',
    quickRemoveHalf: '精簡半數號碼',
    onboardingWelcome: '今日訓練配置',
    activeWorkoutMode: '當前模式',
    workoutObjective: '訓練目標與進度',
    targetGoalProgress: '目標俯臥撐進度',
    boardClearanceProgress: '輪盤清盤進度',
    pocketsCleared: '已清除 {cleared} / {total} 格',
    repsRemaining: '距離目標還剩 {count} 次',
    goalReached: '目標達成！🏆',
    boardCompleted: '輪盤全清！🎉',
    poolRepsRemaining: '號碼池剩餘 {count} 次',
    spinGoalPreview: '+{reps} 次 → {next} / {goal} ({percent}%)',
    spinGoalReachedPreview: '🎉 完成本輪即可達成目標！',
    sessionStats: '本局數據',
  },

  fr: {
    // Header & Nav
    appTitle1: 'ROULETTE',
    appTitle2: 'POMPES',
    appSubtitle: 'Challenge Fitness Casino',
    tabGame: 'Jeu de Pompes',
    tabHistory: 'Historique',
    tabStats: 'Statistiques',
    restTimerTooltip: 'Minuteur de Repos',
    soundToggleTooltip: 'Activer/Désactiver le Son',
    settingsTooltip: 'Règles & Paramètres',
    languageSelect: 'Langue',

    // Turn Callout & Game
    currentSpinner: 'Joueur Actuel',
    totalPushupsLogged: 'total de pompes enregistrées',
    spinWheel: 'Lancer la Roulette 🎲',
    spinning: 'Chanceler...',
    allEliminatedAlert: 'Tous les numéros ont été éliminés ! Réinitialisation automatique.',

    // Side Bet Selector
    riskReward: 'Risque & Récompense',
    betActive: 'PARI ACTIF',
    betNoneSubtitle: 'Standard 1x',
    betRedSubtitle: 'Cases Rouges',
    betBlackSubtitle: 'Cases Noires',
    betOddSubtitle: 'Numéros Impairs',
    betEvenSubtitle: 'Numéros Pairs',

    // Betting Board
    boardTitle: 'Tapis de Roulette & Historique',
    eliminationModeOn: 'Mode Élimination ACTIVÉ',
    eliminationModeOff: 'Tapis Standard (0-36)',
    eliminatedCount: 'Éliminés',
    resetPool: 'Réinitialiser le Tapis',
    lastLanded: 'Dernier Tirage',
    redNumbers: 'Cases Rouges',
    blackNumbers: 'Cases Noires',
    greenZero: 'Zéro Vert',

    // Player Manager
    playersLeaderboard: 'Joueurs & Classement',
    addPlayer: 'Ajouter un Joueur',
    playerNamePlaceholder: 'Nom du Joueur',
    selectAvatar: 'Choisir un Avatar',
    totalReps: 'Total Réps',
    completedReps: 'Complétés',
    maxSingle: 'Max Unique',
    streak: 'Série',
    active: 'Actif',
    switchPlayer: 'Changer de Tour',
    removePlayer: 'Supprimer',
    cancel: 'Annuler',
    savePlayer: 'Enregistrer',

    // Spin Modal
    playerResult: 'Résultat de {name}',
    greenZeroPocket: 'Zéro Vert',
    redPocket: 'Case Rouge',
    blackPocket: 'Case Noire',
    targetPushups: 'Objectif de Pompes',
    calculationBreakdown: 'Détail du Calcul',
    zeroBonusTitle: '🎉 Bonus de Repos !',
    zeroBonusDesc: 'Zéro obtenu ! Prenez une pause méritée.',
    completeReps: 'Valider {count} Pompes',
    partialReps: 'Valider Pompes Partielles',
    passTurn: 'Passer son Tour (0 réps)',
    startRestTimer: 'Lancer le Repos ({seconds}s)',
    customAmount: 'Nombre Personnalisé',
    saveCustom: 'Enregistrer Partiel',

    // Game Settings Modal
    gameRulesSettings: 'Règles & Paramètres',
    eliminationModeTitle: 'Mode Élimination',
    eliminationModeDesc: 'Les numéros tirés sont retirés de la roue jusqu\'à tirer les 37 cases.',
    repCapTitle: 'Limite Max de Pompes',
    repCapDesc: 'Plafonner le nombre max de pompes par lancer (0 = sans limite).',
    uncapped: 'Sans Limite',
    defaultRestTime: 'Temps de Repos Par Défaut',
    seconds: 'secondes',
    soundEffects: 'Effets Sonores',
    soundEffectsDesc: 'Bruits de roulette et fanfare de victoire.',
    autoAdvance: 'Changement de Tour Auto',
    autoAdvanceDesc: 'Passe automatiquement au joueur suivant après chaque tirage.',
    zeroRestBonus: 'Règle Bonus du Zéro',
    zeroRestBonusDesc: 'Obtenir 0 offre 2 minutes de repos gratuites.',
    closeSettings: 'Fermer les Paramètres',

    // History Log
    historyTitle: 'Historique des Lancers',
    noHistory: 'Aucun lancer enregistré. Tournez la roue pour commencer !',
    player: 'Joueur',
    numberLanded: 'Numéro',
    targetReps: 'Objectif',
    repsDone: 'Fait',
    status: 'Statut',
    sideBet: 'Pari Annexe',
    time: 'Heure',
    completed: 'Réussi',
    partial: 'Partiel',
    passed: 'Passé',

    // Stats Dashboard
    analyticsTitle: 'Statistiques & Performances',
    totalPushupsOverall: 'Total de Pompes Réalisées',
    totalSpinsOverall: 'Nombre Total de Tirages',
    avgPushupsPerSpin: 'Moyenne Réps / Tirage',
    leaderboard: 'Classement Général',
    pushupsDistribution: 'Distribution des Cases',

    // Rest Timer
    restTimer: 'Chronomètre de Repos',
    timeRemaining: 'Temps Restant',
    add30s: '+30 Secondes',
    pause: 'Pause',
    resume: 'Reprendre',
    skip: 'Passer le Repos',

    // Welcome & Setup Modal
    welcomeTitle: 'Push-Up Roulette',
    welcomeSubtitle: 'Combien de joueurs participent à la séance aujourd\'hui ?',
    playerCountLabel: 'Nombre de Joueurs',
    pushupsUnit: 'pompes',
    perPlayer: 'joueur',
    targetGoalLabel: 'Total de pompes aujourd\'hui',
    startGameBtn: 'Lancer l\'Entraînement 🚀',
    changeGameSetup: 'Mode / Joueurs',
    goalAchievedTitle: '🏆 Objectif Atteint !',
    goalAchievedDesc: 'Bravo ! Vous avez atteint votre objectif de {target} pompes !',
    continueWorkout: 'Continuer la Séance',
    newGame: 'Nouvelle Séance',
    quickRemoveHalf: 'Réduire de Moitié',
    onboardingWelcome: 'Configuration du Jour',
    activeWorkoutMode: 'Mode Actif',
    workoutObjective: 'Objectif & Progression',
    targetGoalProgress: 'Objectif de Pompes',
    boardClearanceProgress: 'Progression du Tapis',
    pocketsCleared: '{cleared} sur {total} cases éliminées',
    repsRemaining: 'plus que {count} pompes pour atteindre l\'objectif',
    goalReached: 'Objectif Atteint ! 🏆',
    boardCompleted: 'Tapis Terminé ! 🎉',
    poolRepsRemaining: '{count} pompes restantes sur le tapis',
    spinGoalPreview: '+{reps} pompes → {next} / {goal} ({percent}%)',
    spinGoalReachedPreview: '🎉 Ce tirage va valider votre objectif de séance !',
    sessionStats: 'Statistiques de Séance',
  },
};
