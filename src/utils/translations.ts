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
  sideBetTitle: string;
  riskReward: string;
  sideBetWin: string;
  sideBetLose: string;
  betActive: string;
  betNoneTitle: string;
  betNoneSubtitle: string;
  betRedTitle: string;
  betRedSubtitle: string;
  betBlackTitle: string;
  betBlackSubtitle: string;
  betOddTitle: string;
  betOddSubtitle: string;
  betEvenTitle: string;
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
  difficultyHandicap: string;
  diffBeginner: string;
  diffNormal: string;
  diffPro: string;
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
  sideBetWonHeader: string;
  sideBetLostHeader: string;
  sideBetWonSub: string;
  sideBetLostSub: string;
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
  globalMultiplier: string;
  globalMultiplierDesc: string;
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
    sideBetTitle: 'Want a side bet?',
    riskReward: 'Risk & Reward',
    sideBetWin: 'Win: 0.5x Reps',
    sideBetLose: 'Lose: 1.5x Reps',
    betActive: 'BET ACTIVE',
    betNoneTitle: 'No Bet',
    betNoneSubtitle: 'Standard 1x',
    betRedTitle: 'Red',
    betRedSubtitle: 'Red Pockets',
    betBlackTitle: 'Black',
    betBlackSubtitle: 'Black Pockets',
    betOddTitle: 'Odd',
    betOddSubtitle: 'Odd Numbers',
    betEvenTitle: 'Even',
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
    difficultyHandicap: 'Handicap',
    diffBeginner: 'Beginner (0.75x)',
    diffNormal: 'Normal (1.0x)',
    diffPro: 'Pro (1.5x)',
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
    sideBetWonHeader: '🎉 SIDE BET WON!',
    sideBetLostHeader: '💥 SIDE BET LOST!',
    sideBetWonSub: 'Bet on {bet} — Target reps cut in half!',
    sideBetLostSub: 'Bet on {bet} — Target reps increased by 50%!',
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
    globalMultiplier: 'Global Pushup Multiplier',
    globalMultiplierDesc: 'Scale target pushups across all players.',
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
  },

  zh: {
    // Header & Nav
    appTitle1: '轮盘',
    appTitle2: '俯卧撑',
    appSubtitle: '赌场健身挑战赛',
    tabGame: '俯卧撑游戏',
    tabHistory: '历史记录',
    tabStats: '数据分析',
    restTimerTooltip: '休息计时器',
    soundToggleTooltip: '开关音效',
    settingsTooltip: '游戏规则与设置',
    languageSelect: '语言',

    // Turn Callout & Game
    currentSpinner: '当前玩家',
    totalPushupsLogged: '累计完成俯卧撑',
    spinWheel: '旋转轮盘 🎲',
    spinning: '旋转中...',
    allEliminatedAlert: '所有数字均已被淘汰！自动重置轮盘号码池。',

    // Side Bet Selector
    sideBetTitle: '要下边注吗？',
    riskReward: '高风险高回报',
    sideBetWin: '赢：0.5倍个数',
    sideBetLose: '输：1.5倍个数',
    betActive: '边注生效中',
    betNoneTitle: '不下注',
    betNoneSubtitle: '标准 1x',
    betRedTitle: '红色',
    betRedSubtitle: '红槽数字',
    betBlackTitle: '黑色',
    betBlackSubtitle: '黑槽数字',
    betOddTitle: '单数',
    betOddSubtitle: '奇数数字',
    betEvenTitle: '双数',
    betEvenSubtitle: '偶数数字',

    // Betting Board
    boardTitle: '轮盘棋盘与历史记录',
    eliminationModeOn: '淘汰模式 已开启',
    eliminationModeOff: '标准号码池 (0-36)',
    eliminatedCount: '已淘汰',
    resetPool: '重置号码池',
    lastLanded: '上轮转出',
    redNumbers: '红槽数字',
    blackNumbers: '黑槽数字',
    greenZero: '绿色零号',

    // Player Manager
    playersLeaderboard: '玩家与排行榜',
    addPlayer: '添加玩家',
    playerNamePlaceholder: '玩家姓名',
    selectAvatar: '选择头像',
    difficultyHandicap: '难度系数',
    diffBeginner: '新手 (0.75x)',
    diffNormal: '普通 (1.0x)',
    diffPro: '专家 (1.5x)',
    totalReps: '总次数',
    completedReps: '已完成',
    maxSingle: '单次最高',
    streak: '连胜',
    active: '当前',
    switchPlayer: '切换回合',
    removePlayer: '移除',
    cancel: '取消',
    savePlayer: '保存玩家',

    // Spin Modal
    playerResult: '{name} 的结果',
    greenZeroPocket: '绿色零号',
    redPocket: '红槽',
    blackPocket: '黑槽',
    sideBetWonHeader: '🎉 边注赢了！',
    sideBetLostHeader: '💥 边注输了！',
    sideBetWonSub: '下注 {bet} 成功 — 目标俯卧撑减半！',
    sideBetLostSub: '下注 {bet} 失败 — 目标俯卧撑增加50%！',
    targetPushups: '目标俯卧撑',
    calculationBreakdown: '计算明细',
    zeroBonusTitle: '🎉 休息奖励！',
    zeroBonusDesc: '转中0号！获得免费休息时间。',
    completeReps: '完成 {count} 次',
    partialReps: '记录部分次数',
    passTurn: '放弃本轮 (0次)',
    startRestTimer: '开启休息计时器 ({seconds}秒)',
    customAmount: '自定义次数',
    saveCustom: '保存部分次数',

    // Game Settings Modal
    gameRulesSettings: '游戏规则与设置',
    eliminationModeTitle: '淘汰模式',
    eliminationModeDesc: '转中的数字将被移除，直到37个数字全部被击中。',
    repCapTitle: '单次最高上限',
    repCapDesc: '设置单次最多个数（0表示不上限）。',
    uncapped: '无上限',
    globalMultiplier: '全局俯卧撑倍数',
    globalMultiplierDesc: '调整所有玩家的目标次数倍率。',
    defaultRestTime: '默认休息时间',
    seconds: '秒',
    soundEffects: '音效开关',
    soundEffectsDesc: '轮盘旋转声和胜利音效。',
    autoAdvance: '自动切换回合',
    autoAdvanceDesc: '记录次数后自动切换到下一位玩家。',
    zeroRestBonus: '零号休息奖励规则',
    zeroRestBonusDesc: '转中0号奖励玩家2分钟休息时间。',
    closeSettings: '关闭设置',

    // History Log
    historyTitle: '转盘历史与日志',
    noHistory: '暂无记录。旋转轮盘开始游戏吧！',
    player: '玩家',
    numberLanded: '转出数字',
    targetReps: '目标',
    repsDone: '完成',
    status: '状态',
    sideBet: '边注',
    time: '时间',
    completed: '完全完成',
    partial: '部分完成',
    passed: '已放弃',

    // Stats Dashboard
    analyticsTitle: '玩家数据与表现',
    totalPushupsOverall: '累计完成俯卧撑',
    totalSpinsOverall: '累计旋转次数',
    avgPushupsPerSpin: '平均每次个数',
    leaderboard: '排行榜名次',
    pushupsDistribution: '数字槽分布',

    // Rest Timer
    restTimer: '休息与恢复计时器',
    timeRemaining: '剩余时间',
    add30s: '+30 秒',
    pause: '暂停',
    resume: '继续',
    skip: '跳过休息',
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
    sideBetTitle: 'Placer un pari secondaire ?',
    riskReward: 'Risque & Récompense',
    sideBetWin: 'Gagné : 0.5x Répétitions',
    sideBetLose: 'Perdu : 1.5x Répétitions',
    betActive: 'PARI ACTIF',
    betNoneTitle: 'Aucun Pari',
    betNoneSubtitle: 'Standard 1x',
    betRedTitle: 'Rouge',
    betRedSubtitle: 'Cases Rouges',
    betBlackTitle: 'Noir',
    betBlackSubtitle: 'Cases Noires',
    betOddTitle: 'Impair',
    betOddSubtitle: 'Numéros Impairs',
    betEvenTitle: 'Pair',
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
    difficultyHandicap: 'Handicap',
    diffBeginner: 'Débutant (0.75x)',
    diffNormal: 'Normal (1.0x)',
    diffPro: 'Pro (1.5x)',
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
    sideBetWonHeader: '🎉 PARI SECONDAIRE GAGNÉ !',
    sideBetLostHeader: '💥 PARI SECONDAIRE PERDU !',
    sideBetWonSub: 'Parié sur {bet} — Objectif réduit de moitié !',
    sideBetLostSub: 'Parié sur {bet} — Objectif augmenté de 50% !',
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
    globalMultiplier: 'Multiplicateur Global',
    globalMultiplierDesc: 'Ajuster la difficulté pour tous les joueurs.',
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
  },
};
