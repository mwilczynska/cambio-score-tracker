// Cambio Score Tracker - Shared Constants

// Anger level thresholds for character expressions
export const ANGER_THRESHOLDS = {
    ANNOYED: 10,  // Delta >= 10 shows annoyed expression
    ANGRY: 20     // Delta >= 20 shows angry expression
};

// Player names (can be customized)
export const PLAYERS = {
    PLAYER_1: 'Mike',
    PLAYER_2: 'Preeta'
};

// CSV headers for export/import
export const CSV_HEADERS = [
    'Session',
    'Mike_Score',
    'Preeta_Score',
    'Mike_Session_Total',
    'Preeta_Session_Total',
    'Mike_Overall_Total',
    'Preeta_Overall_Total'
];
