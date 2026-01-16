// Cambio Score Tracker - CSV Utilities
// Copied from ../../shared/csvUtils.js for React Native compatibility

import { CSV_HEADERS } from './constants';

/**
 * Generate CSV content from rounds data
 * @param {Array} rounds - Array of round objects
 * @returns {string} CSV formatted string
 */
export function exportToCSV(rounds) {
    if (!rounds || rounds.length === 0) {
        return null;
    }

    const csvContent = [
        CSV_HEADERS.join(','),
        ...rounds.map(round => [
            round.session,
            round.mikeScore,
            round.preetaScore,
            round.mikeSessionTotal,
            round.preetaSessionTotal,
            round.mikeOverallTotal,
            round.preetaOverallTotal
        ].join(','))
    ].join('\n');

    return csvContent;
}

/**
 * Parse CSV content into rounds data
 * @param {string} csvContent - CSV formatted string
 * @returns {Array} Array of round objects
 */
export function parseCSV(csvContent) {
    if (!csvContent || typeof csvContent !== 'string') {
        throw new Error('Invalid CSV content');
    }

    const lines = csvContent.split('\n');

    // Skip header line and filter empty lines
    const dataLines = lines.slice(1).filter(line => line.trim());

    if (dataLines.length === 0) {
        throw new Error('No data found in CSV');
    }

    const rounds = dataLines.map((line, index) => {
        const values = line.split(',').map(val => parseInt(val.trim()));

        if (values.length < 7 || values.some(isNaN)) {
            throw new Error(`Invalid data at line ${index + 2}`);
        }

        const [session, mikeScore, preetaScore, mikeSessionTotal, preetaSessionTotal, mikeOverallTotal, preetaOverallTotal] = values;

        return {
            session,
            mikeScore,
            preetaScore,
            mikeSessionTotal,
            preetaSessionTotal,
            mikeOverallTotal,
            preetaOverallTotal
        };
    });

    return rounds;
}

/**
 * Generate filename for CSV export
 * @returns {string} Filename with current date
 */
export function generateCSVFilename() {
    const date = new Date().toISOString().split('T')[0];
    return `cambio_scores_${date}.csv`;
}
