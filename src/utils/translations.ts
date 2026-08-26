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

  // Welcome & Setup Modal
  welcomeTitle: string;
  welcomeSubtitle: string;
  playerCountLabel: string;
  soloMode: string;
  soloModeDesc: string;
  duoMode: string;
  duoModeDesc: string;
  squadMode: string;
  squadModeDesc: string;
  customPlayerCount: string;
  selectSoloPresetTitle: string;
  selectSoloPresetDesc: string;
  presetCasualTitle: string;
  presetCasualDesc: string;
  presetStandardTitle: string;
  presetStandardDesc: string;
  presetTargetTitle: string;
  presetTargetDesc: string;
  presetGauntletTitle: string;
  presetGauntletDesc: string;
  targetGoalLabel: string;
  targetGoalHelp: string;
  setupPlayersTitle: string;
  startGameBtn: string;
  changeGameSetup: string;
  goalAchievedTitle: string;
  goalAchievedDesc: string;
  allEliminatedSoloCleared: string;
  continueWorkout: string;
  newGame: string;
  halfBoardOptionTitle: string;
  halfBoardOptionDesc: string;
  halfBoardNone: string;
  halfBoardLow: string;
  halfBoardRandom: string;
  halfBoardOdd: string;
  halfBoardEven: string;
  quickRemoveHalf: string;
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

    // Welcome & Setup Modal
    welcomeTitle: 'Push-Up Roulette',
    welcomeSubtitle: 'How many players are joining the workout today?',
    playerCountLabel: 'Number of Players',
    soloMode: '1 Player (Solo Challenge)',
    soloModeDesc: 'Customized difficulty & balanced targets tailored for a single player',
    duoMode: '2 Players (Duo Battle)',
    duoModeDesc: 'Head-to-head pushup showdown, taking turns at the wheel',
    squadMode: '3+ Players (Squad Party)',
    squadModeDesc: 'Group workout splitting the roulette gauntlet across friends',
    customPlayerCount: 'Custom Player Count',
    selectSoloPresetTitle: 'Select Solo Workout Mode',
    selectSoloPresetDesc: 'Clearing all 36 pockets is 666 reps! Choose your solo balance preset:',
    presetCasualTitle: 'Casual Fitness (Recommended)',
    presetCasualDesc: '0.5x multiplier, capped at max 15 reps per spin (~150-180 reps total)',
    presetStandardTitle: 'Standard Workout',
    presetStandardDesc: '0.75x multiplier, capped at max 20 reps per spin (~250 reps total)',
    presetTargetTitle: 'Target Goal Challenge',
    presetTargetDesc: 'Race to hit a target pushup milestone (e.g. 50, 100, 150 reps)',
    presetGauntletTitle: 'Hardcore Gauntlet (666 Reps)',
    presetGauntletDesc: 'Full 1.0x uncapped roulette challenge for elite athletes',
    targetGoalLabel: 'Target Pushup Milestone',
    targetGoalHelp: 'The session ends in victory once your total pushups reach this goal.',
    setupPlayersTitle: 'Player Lineup & Profiles',
    startGameBtn: 'Start Workout 🚀',
    changeGameSetup: 'Setup / Mode',
    goalAchievedTitle: '🏆 Target Goal Achieved!',
    goalAchievedDesc: 'Outstanding work! You hit your workout target of {target} pushups!',
    allEliminatedSoloCleared: '🎉 Roulette Gauntlet Cleared! You defeated all numbers on the board!',
    continueWorkout: 'Keep Going',
    newGame: 'New Workout Session',
    halfBoardOptionTitle: 'Half-Board Mode (Remove Half)',
    halfBoardOptionDesc: 'Remove half the numbers from the wheel pool to make clearing the board fast & achievable',
    halfBoardNone: 'Full Board (All 36 Numbers)',
    halfBoardLow: 'Low Numbers Only (1 to 18) [171 reps total]',
    halfBoardRandom: '18 Random Numbers [~333 reps total]',
    halfBoardOdd: 'Odd Numbers Only (1, 3... 35)',
    halfBoardEven: 'Even Numbers Only (2, 4... 36)',
    quickRemoveHalf: 'Trim Half Board',
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
    sideBetTitle: '要下邊注嗎？',
    riskReward: '高風險高回報',
    sideBetWin: '贏：0.5倍個數',
    sideBetLose: '輸：1.5倍個數',
    betActive: '邊注生效中',
    betNoneTitle: '不下注',
    betNoneSubtitle: '標準 1x',
    betRedTitle: '紅色',
    betRedSubtitle: '紅槽數字',
    betBlackTitle: '黑色',
    betBlackSubtitle: '黑槽數字',
    betOddTitle: '單數',
    betOddSubtitle: '奇數數字',
    betEvenTitle: '雙數',
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
    difficultyHandicap: '難度係數',
    diffBeginner: '新手 (0.75x)',
    diffNormal: '普通 (1.0x)',
    diffPro: '專家 (1.5x)',
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
    sideBetWonHeader: '🎉 邊注贏了！',
    sideBetLostHeader: '💥 邊注輸了！',
    sideBetWonSub: '下注 {bet} 成功 — 目標俯臥撐減半！',
    sideBetLostSub: '下注 {bet} 失敗 — 目標俯臥撐增加50%！',
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
    globalMultiplier: '全局俯臥撐倍數',
    globalMultiplierDesc: '調整所有玩家的目標次數倍率。',
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
    soloMode: '1位玩家 (單人挑戰)',
    soloModeDesc: '為單人量身定制的平衡難度與目標模式',
    duoMode: '2位玩家 (雙人對戰)',
    duoModeDesc: '輪流轉動輪盤，一對一俯臥撐對決',
    squadMode: '3位以上 (多人派對)',
    squadModeDesc: '團隊協作，共同分擔輪盤總次數',
    customPlayerCount: '自定義人數',
    selectSoloPresetTitle: '選擇單人遊戲模式',
    selectSoloPresetDesc: '轉完所有36個格子需要做666個俯臥撐！請選擇適合您的難度預設：',
    presetCasualTitle: '休閒健身 (推薦)',
    presetCasualDesc: '0.5倍係數，單次最多15個 (整局約150-180個)',
    presetStandardTitle: '標準鍛煉',
    presetStandardDesc: '0.75倍係數，單次最多20個 (整局約250個)',
    presetTargetTitle: '目標挑戰模式',
    presetTargetDesc: '自定義目標總個數 (例如 50、100、150個)，達成即獲勝',
    presetGauntletTitle: '極限通關 (666個)',
    presetGauntletDesc: '完整 1.0倍無上限輪盤挑戰，獻給硬核健身達人',
    targetGoalLabel: '目標俯臥撐總數',
    targetGoalHelp: '當累計俯臥撐達到此目標時，挑戰宣告成功。',
    setupPlayersTitle: '玩家名單與個人設定',
    startGameBtn: '開始訓練 🚀',
    changeGameSetup: '模式設定',
    goalAchievedTitle: '🏆 目標達成！',
    goalAchievedDesc: '太棒了！您已成功完成 {target} 個俯臥撐的訓練目標！',
    allEliminatedSoloCleared: '🎉 輪盤全清！恭喜您擊敗了輪盤上的所有號碼！',
    continueWorkout: '繼續挑戰',
    newGame: '開始新回合',
    halfBoardOptionTitle: '半盤模式 (移除半數號碼)',
    halfBoardOptionDesc: '開局預先移除一半號碼，讓單人通關更快、更輕鬆',
    halfBoardNone: '完整輪盤 (全部36個號碼)',
    halfBoardLow: '僅小號 (1 到 18) [總計171次]',
    halfBoardRandom: '隨機18個號碼 [總計約333次]',
    halfBoardOdd: '僅單數號碼 (1, 3... 35)',
    halfBoardEven: '僅雙數號碼 (2, 4... 36)',
    quickRemoveHalf: '精簡半數號碼',
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

    // Welcome & Setup Modal
    welcomeTitle: 'Push-Up Roulette',
    welcomeSubtitle: 'Combien de joueurs participent à la séance aujourd\'hui ?',
    playerCountLabel: 'Nombre de Joueurs',
    soloMode: '1 Joueur (Défi Solo)',
    soloModeDesc: 'Entraînement calibré avec équilibrage et objectifs sur mesure',
    duoMode: '2 Joueurs (Duel Face-à-Face)',
    duoModeDesc: 'Chacun son tour à la roulette pour un affrontement intense',
    squadMode: '3+ Joueurs (En Équipe / Fête)',
    squadModeDesc: 'Séance de groupe pour partager les 666 pompes du tapis',
    customPlayerCount: 'Nombre de Joueurs Personnalisé',
    selectSoloPresetTitle: 'Choisir le Mode Solo',
    selectSoloPresetDesc: 'Valider les 36 cases représente 666 pompes ! Choisissez votre niveau de difficulté :',
    presetCasualTitle: 'Fitness Équilibré (Recommandé)',
    presetCasualDesc: 'Multiplicateur 0.5x, max 15 pompes par tirage (~150-180 pompes au total)',
    presetStandardTitle: 'Entraînement Standard',
    presetStandardDesc: 'Multiplicateur 0.75x, max 20 pompes par tirage (~250 pompes au total)',
    presetTargetTitle: 'Défi Objectif Ciblé',
    presetTargetDesc: 'Atteindre un objectif total défini (ex. 50, 100, 150 pompes)',
    presetGauntletTitle: 'Le Grand Chelem (666 Pompes)',
    presetGauntletDesc: 'Multiplicateur 1.0x sans limite. Le défi extrême pour athlètes aguerris',
    targetGoalLabel: 'Objectif de Pompes Total',
    targetGoalHelp: 'La séance se termine victorieusement dès que votre total atteint cet objectif.',
    setupPlayersTitle: 'Configuration des Joueurs',
    startGameBtn: 'Lancer l\'Entraînement 🚀',
    changeGameSetup: 'Mode / Joueurs',
    goalAchievedTitle: '🏆 Objectif Atteint !',
    goalAchievedDesc: 'Bravo ! Vous avez atteint votre objectif de {target} pompes !',
    allEliminatedSoloCleared: '🎉 Tapis Terminé ! Vous avez éliminé toutes les cases de la roulette !',
    continueWorkout: 'Continuer la Séance',
    newGame: 'Nouvelle Séance',
    halfBoardOptionTitle: 'Mode Demi-Tapis (Retirer la Moitié)',
    halfBoardOptionDesc: 'Retirer la moitié des numéros pour une séance solo plus rapide et accessible',
    halfBoardNone: 'Tapis Complet (36 Numéros)',
    halfBoardLow: 'Petits Numéros Uniquement (1 à 18) [171 pompes]',
    halfBoardRandom: '18 Numéros Aléatoires [~333 pompes]',
    halfBoardOdd: 'Numéros Impairs Uniquement (1, 3... 35)',
    halfBoardEven: 'Numéros Pairs Uniquement (2, 4... 36)',
    quickRemoveHalf: 'Réduire de Moitié',
  },
};
