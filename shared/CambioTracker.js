// Cambio Score Tracker - Core Business Logic
// This file contains pure business logic with no DOM or platform-specific code

import { ANGER_THRESHOLDS } from './constants.js';

/**
 * Core Cambio Tracker class with all game logic
 * Platform-agnostic: no DOM, no localStorage, no React
 */
export class CambioTrackerCore {
    constructor(initialData = null) {
        this.rounds = [];
        this.currentSession = 1;

        if (initialData) {
            this.rounds = initialData.rounds || [];
            this.currentSession = initialData.currentSession || 1;
        }
    }

    /**
     * Get current state for persistence
     * @returns {Object} Current state with rounds and session
     */
    getState() {
        return {
            rounds: this.rounds,
            currentSession: this.currentSession
        };
    }

    /**
     * Load state from persisted data
     * @param {Object} data - Saved state object
     */
    loadState(data) {
        if (data) {
            this.rounds = data.rounds || [];
            this.currentSession = data.currentSession || 1;
        }
    }

    /**
     * Add a new round with scores
     * @param {number} mikeScore - Mike's score for this round
     * @param {number} preetaScore - Preeta's score for this round
     * @returns {Object} The newly created round
     */
    addRound(mikeScore, preetaScore) {
        // Get previous totals
        let mikePrevSessionTotal = 0;
        let preetaPrevSessionTotal = 0;
        let mikePrevOverallTotal = 0;
        let preetaPrevOverallTotal = 0;

        // Find the last round in the current session
        const currentSessionRounds = this.rounds.filter(r => r.session === this.currentSession);
        if (currentSessionRounds.length > 0) {
            const lastRound = currentSessionRounds[currentSessionRounds.length - 1];
            mikePrevSessionTotal = lastRound.mikeSessionTotal;
            preetaPrevSessionTotal = lastRound.preetaSessionTotal;
            mikePrevOverallTotal = lastRound.mikeOverallTotal;
            preetaPrevOverallTotal = lastRound.preetaOverallTotal;
        } else if (this.rounds.length > 0) {
            // New session - get overall totals from last round of previous session
            const lastRound = this.rounds[this.rounds.length - 1];
            mikePrevOverallTotal = lastRound.mikeOverallTotal;
            preetaPrevOverallTotal = lastRound.preetaOverallTotal;
        }

        // Calculate new totals
        const round = {
            session: this.currentSession,
            mikeScore: mikeScore,
            preetaScore: preetaScore,
            mikeSessionTotal: mikePrevSessionTotal + mikeScore,
            preetaSessionTotal: preetaPrevSessionTotal + preetaScore,
            mikeOverallTotal: mikePrevOverallTotal + mikeScore,
            preetaOverallTotal: preetaPrevOverallTotal + preetaScore
        };

        this.rounds.push(round);
        return round;
    }

    /**
     * Delete a round at the specified index
     * @param {number} index - Index of round to delete
     */
    deleteRound(index) {
        if (index < 0 || index >= this.rounds.length) {
            throw new Error('Invalid round index');
        }

        this.rounds.splice(index, 1);
        this.recalculateAllTotals();

        // Update current session
        if (this.rounds.length > 0) {
            const lastRound = this.rounds[this.rounds.length - 1];
            this.currentSession = lastRound.session + 1;
        } else {
            this.currentSession = 1;
        }
    }

    /**
     * Edit a round's scores
     * @param {number} index - Index of round to edit
     * @param {number} newMikeScore - New Mike score
     * @param {number} newPreetaScore - New Preeta score
     */
    editRound(index, newMikeScore, newPreetaScore) {
        if (index < 0 || index >= this.rounds.length) {
            throw new Error('Invalid round index');
        }

        if (isNaN(newMikeScore) || isNaN(newPreetaScore)) {
            throw new Error('Invalid score values');
        }

        this.rounds[index].mikeScore = newMikeScore;
        this.rounds[index].preetaScore = newPreetaScore;
        this.recalculateAllTotals();
    }

    /**
     * Start a new session
     */
    startNewSession() {
        this.currentSession++;
    }

    /**
     * Recalculate all session and overall totals from scratch
     */
    recalculateAllTotals() {
        let currentSession = 1;
        let mikeSessionTotal = 0;
        let preetaSessionTotal = 0;
        let mikeOverallTotal = 0;
        let preetaOverallTotal = 0;

        this.rounds.forEach((round, index) => {
            // If session changed, reset session totals
            if (round.session !== currentSession) {
                currentSession = round.session;
                mikeSessionTotal = 0;
                preetaSessionTotal = 0;
            }

            // Add current round scores
            mikeSessionTotal += round.mikeScore;
            preetaSessionTotal += round.preetaScore;
            mikeOverallTotal += round.mikeScore;
            preetaOverallTotal += round.preetaScore;

            // Update the round with recalculated totals
            this.rounds[index].mikeSessionTotal = mikeSessionTotal;
            this.rounds[index].preetaSessionTotal = preetaSessionTotal;
            this.rounds[index].mikeOverallTotal = mikeOverallTotal;
            this.rounds[index].preetaOverallTotal = preetaOverallTotal;
        });
    }

    /**
     * Get current session totals
     * @returns {Object} Session totals for both players
     */
    getSessionTotals() {
        let mikeSessionTotal = 0;
        let preetaSessionTotal = 0;

        const currentSessionRounds = this.rounds.filter(r => r.session === this.currentSession);
        if (currentSessionRounds.length > 0) {
            const lastRound = currentSessionRounds[currentSessionRounds.length - 1];
            mikeSessionTotal = lastRound.mikeSessionTotal;
            preetaSessionTotal = lastRound.preetaSessionTotal;
        }

        return { mikeSessionTotal, preetaSessionTotal };
    }

    /**
     * Get overall totals
     * @returns {Object} Overall totals for both players
     */
    getOverallTotals() {
        let mikeOverallTotal = 0;
        let preetaOverallTotal = 0;

        if (this.rounds.length > 0) {
            const lastRound = this.rounds[this.rounds.length - 1];
            mikeOverallTotal = lastRound.mikeOverallTotal;
            preetaOverallTotal = lastRound.preetaOverallTotal;
        }

        return { mikeOverallTotal, preetaOverallTotal };
    }

    /**
     * Calculate session delta (positive means Mike is losing/higher score)
     * @returns {number} Session delta
     */
    getSessionDelta() {
        const { mikeSessionTotal, preetaSessionTotal } = this.getSessionTotals();
        return mikeSessionTotal - preetaSessionTotal;
    }

    /**
     * Calculate overall delta
     * @returns {number} Overall delta
     */
    getOverallDelta() {
        const { mikeOverallTotal, preetaOverallTotal } = this.getOverallTotals();
        return mikeOverallTotal - preetaOverallTotal;
    }

    /**
     * Format delta for display
     * @param {number} deltaValue - The delta value
     * @returns {string} Formatted delta string
     */
    formatDelta(deltaValue) {
        if (deltaValue > 0) {
            return `+${deltaValue} (Mike)`;
        } else if (deltaValue < 0) {
            return `+${Math.abs(deltaValue)} (Preeta)`;
        } else {
            return '0 (Tied)';
        }
    }

    /**
     * Get anger level based on session delta
     * @returns {Object} Anger levels for both players
     */
    getAngerLevels() {
        const sessionDelta = this.getSessionDelta();
        const absDelta = Math.abs(sessionDelta);

        let mikeAnger = 'neutral';
        let preetaAnger = 'neutral';

        if (sessionDelta > 0) {
            // Mike has higher score (losing in Cambio)
            if (absDelta >= ANGER_THRESHOLDS.ANGRY) {
                mikeAnger = 'angry';
            } else if (absDelta >= ANGER_THRESHOLDS.ANNOYED) {
                mikeAnger = 'annoyed';
            }
        } else if (sessionDelta < 0) {
            // Preeta has higher score (losing)
            if (absDelta >= ANGER_THRESHOLDS.ANGRY) {
                preetaAnger = 'angry';
            } else if (absDelta >= ANGER_THRESHOLDS.ANNOYED) {
                preetaAnger = 'annoyed';
            }
        }

        return { mikeAnger, preetaAnger };
    }

    /**
     * Get all rounds in reverse order (newest first)
     * @returns {Array} Rounds in reverse chronological order
     */
    getRoundsReversed() {
        return [...this.rounds].reverse();
    }

    /**
     * Clear all data
     */
    clearAllData() {
        this.rounds = [];
        this.currentSession = 1;
    }

    /**
     * Import rounds from CSV data
     * @param {Array} rounds - Parsed rounds from CSV
     */
    importRounds(rounds) {
        this.rounds = rounds;
        if (this.rounds.length > 0) {
            this.currentSession = this.rounds[this.rounds.length - 1].session + 1;
        } else {
            this.currentSession = 1;
        }
    }
}
