// React Hook for Cambio Score Tracker

import { useState, useEffect, useCallback } from 'react';
import { CambioTrackerCore } from '../shared/CambioTracker';
import { saveData, loadData } from '../storage/asyncStorage';

/**
 * Custom hook for managing Cambio game state
 * @returns {Object} Tracker state and methods
 */
export function useCambioTracker() {
    const [tracker] = useState(() => new CambioTrackerCore());
    const [isLoading, setIsLoading] = useState(true);
    const [, forceUpdate] = useState({});

    // Force re-render when tracker state changes
    const refresh = useCallback(() => {
        forceUpdate({});
    }, []);

    // Load data on mount
    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData();
                if (data) {
                    tracker.loadState(data);
                }
            } catch (e) {
                console.error('Error loading data:', e);
            } finally {
                setIsLoading(false);
                refresh();
            }
        };
        load();
    }, [tracker, refresh]);

    // Save and refresh helper
    const saveAndRefresh = useCallback(async () => {
        await saveData(tracker.getState());
        refresh();
    }, [tracker, refresh]);

    // Add a new round
    const addRound = useCallback(async (mikeScore, preetaScore) => {
        tracker.addRound(mikeScore, preetaScore);
        await saveAndRefresh();
    }, [tracker, saveAndRefresh]);

    // Delete a round
    const deleteRound = useCallback(async (index) => {
        tracker.deleteRound(index);
        await saveAndRefresh();
    }, [tracker, saveAndRefresh]);

    // Edit a round
    const editRound = useCallback(async (index, mikeScore, preetaScore) => {
        tracker.editRound(index, mikeScore, preetaScore);
        await saveAndRefresh();
    }, [tracker, saveAndRefresh]);

    // Start new session
    const startNewSession = useCallback(async () => {
        tracker.startNewSession();
        await saveAndRefresh();
    }, [tracker, saveAndRefresh]);

    // Clear all data
    const clearAllData = useCallback(async () => {
        tracker.clearAllData();
        await saveAndRefresh();
    }, [tracker, saveAndRefresh]);

    // Import rounds
    const importRounds = useCallback(async (rounds) => {
        tracker.importRounds(rounds);
        await saveAndRefresh();
    }, [tracker, saveAndRefresh]);

    return {
        // State
        isLoading,
        rounds: tracker.rounds,
        currentSession: tracker.currentSession,

        // Computed values
        sessionTotals: tracker.getSessionTotals(),
        overallTotals: tracker.getOverallTotals(),
        sessionDelta: tracker.getSessionDelta(),
        overallDelta: tracker.getOverallDelta(),
        angerLevels: tracker.getAngerLevels(),
        roundsReversed: tracker.getRoundsReversed(),

        // Methods
        formatDelta: (delta) => tracker.formatDelta(delta),
        addRound,
        deleteRound,
        editRound,
        startNewSession,
        clearAllData,
        importRounds,
    };
}
