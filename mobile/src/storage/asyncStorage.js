// AsyncStorage adapter for Cambio Score Tracker

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cambioScores';

/**
 * Save data to AsyncStorage
 * @param {Object} data - Data to save
 */
export async function saveData(data) {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Error saving data:', e);
        throw e;
    }
}

/**
 * Load data from AsyncStorage
 * @returns {Object|null} Loaded data or null if not found
 */
export async function loadData() {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Error loading data:', e);
        return null;
    }
}

/**
 * Clear all data from AsyncStorage
 */
export async function clearData() {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Error clearing data:', e);
        throw e;
    }
}
