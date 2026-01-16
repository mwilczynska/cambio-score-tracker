// Cambio Score Tracker - Web Application
// Uses shared business logic from ../shared/

import { CambioTrackerCore } from '../shared/CambioTracker.js';
import { exportToCSV, parseCSV, generateCSVFilename } from '../shared/csvUtils.js';

/**
 * Web-specific wrapper for CambioTracker
 * Handles DOM manipulation, localStorage, and browser-specific features
 */
class CambioTrackerWeb {
    constructor() {
        // Load data from localStorage
        const savedData = this.loadFromStorage();

        // Initialize core tracker with saved data
        this.tracker = new CambioTrackerCore(savedData);

        this.initializeEventListeners();
        this.updateUI();
    }

    // Load data from localStorage
    loadFromStorage() {
        const savedData = localStorage.getItem('cambioScores');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return null;
    }

    // Save data to localStorage
    saveToStorage() {
        const data = this.tracker.getState();
        localStorage.setItem('cambioScores', JSON.stringify(data));
    }

    // Initialize event listeners
    initializeEventListeners() {
        document.getElementById('scoreForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRound();
        });

        document.getElementById('newSessionBtn').addEventListener('click', () => {
            this.startNewSession();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportCSV();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importCSV(e.target.files[0]);
        });

        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Event listeners for +/- toggle buttons
        document.querySelectorAll('.btn-toggle-sign').forEach(button => {
            button.addEventListener('click', () => {
                const inputId = button.dataset.input;
                const input = document.getElementById(inputId);
                const currentValue = input.value.trim();

                if (currentValue === '' || currentValue === '0') {
                    return;
                }

                if (currentValue.startsWith('-')) {
                    input.value = currentValue.substring(1);
                } else {
                    input.value = '-' + currentValue;
                }
            });
        });

        // Event delegation for edit/delete/save/cancel buttons in historical rounds
        document.getElementById('recentRounds').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-edit')) {
                const index = parseInt(e.target.dataset.index);
                this.editRound(index);
            } else if (e.target.classList.contains('btn-delete')) {
                const index = parseInt(e.target.dataset.index);
                this.deleteRound(index);
            } else if (e.target.classList.contains('btn-save')) {
                const index = parseInt(e.target.dataset.index);
                this.saveEditedRound(index);
            } else if (e.target.classList.contains('btn-cancel')) {
                this.cancelEdit();
            }
        });
    }

    // Add a new round
    addRound() {
        const mikeScore = parseInt(document.getElementById('mikeScore').value);
        const preetaScore = parseInt(document.getElementById('preetaScore').value);

        this.tracker.addRound(mikeScore, preetaScore);
        this.saveToStorage();
        this.updateUI();

        // Clear form
        document.getElementById('scoreForm').reset();
        document.getElementById('mikeScore').focus();
    }

    // Start a new session
    startNewSession() {
        if (confirm('Are you sure you want to start a new session?')) {
            this.tracker.startNewSession();
            this.saveToStorage();
            this.updateUI();
        }
    }

    // Update the UI
    updateUI() {
        // Update session number
        document.getElementById('currentSession').textContent = this.tracker.currentSession;

        // Update totals using core methods
        const { mikeSessionTotal, preetaSessionTotal } = this.tracker.getSessionTotals();
        const { mikeOverallTotal, preetaOverallTotal } = this.tracker.getOverallTotals();

        document.getElementById('mikeSessionTotal').textContent = mikeSessionTotal;
        document.getElementById('preetaSessionTotal').textContent = preetaSessionTotal;
        document.getElementById('mikeOverallTotal').textContent = mikeOverallTotal;
        document.getElementById('preetaOverallTotal').textContent = preetaOverallTotal;

        // Update deltas
        const sessionDelta = this.tracker.getSessionDelta();
        const totalDelta = this.tracker.getOverallDelta();

        document.getElementById('sessionDelta').textContent = this.tracker.formatDelta(sessionDelta);
        document.getElementById('totalDelta').textContent = this.tracker.formatDelta(totalDelta);

        // Update character images
        this.updateCharacterImages();

        // Update recent rounds
        this.updateRecentRounds();
    }

    // Update character images based on anger levels
    updateCharacterImages() {
        const { mikeAnger, preetaAnger } = this.tracker.getAngerLevels();

        const mikeImage = document.getElementById('mikeImage');
        const preetaImage = document.getElementById('preetaImage');

        mikeImage.src = `images/mike_${mikeAnger}.png`;
        preetaImage.src = `images/preeta_${preetaAnger}.png`;
    }

    // Update historical rounds display
    updateRecentRounds() {
        const recentRoundsDiv = document.getElementById('recentRounds');

        if (this.tracker.rounds.length === 0) {
            recentRoundsDiv.innerHTML = '<div class="empty-state">No rounds yet. Add your first round above!</div>';
            return;
        }

        // Show all rounds in reverse order (newest first)
        const allRounds = this.tracker.getRoundsReversed();

        // Build table with headers
        let tableHTML = `
            <div class="rounds-table">
                <div class="rounds-header">
                    <div class="header-cell">Round</div>
                    <div class="header-cell">Session</div>
                    <div class="header-cell-group">
                        <div class="player-header">Mike</div>
                        <div class="subheader-group">
                            <div class="subheader">Round</div>
                            <div class="subheader">Session</div>
                            <div class="subheader">Total</div>
                        </div>
                    </div>
                    <div class="header-cell-group">
                        <div class="player-header">Preeta</div>
                        <div class="subheader-group">
                            <div class="subheader">Round</div>
                            <div class="subheader">Session</div>
                            <div class="subheader">Total</div>
                        </div>
                    </div>
                    <div class="header-cell">Actions</div>
                </div>
                <div class="rounds-body">
        `;

        // Add each round row
        allRounds.forEach((round, reverseIndex) => {
            const actualIndex = this.tracker.rounds.length - 1 - reverseIndex;
            const roundNumber = actualIndex + 1;

            tableHTML += `
                <div class="round-row">
                    <div class="cell">${roundNumber}</div>
                    <div class="cell">${round.session}</div>
                    <div class="cell-group">
                        <div class="cell">${round.mikeScore}</div>
                        <div class="cell">${round.mikeSessionTotal}</div>
                        <div class="cell">${round.mikeOverallTotal}</div>
                    </div>
                    <div class="cell-group">
                        <div class="cell">${round.preetaScore}</div>
                        <div class="cell">${round.preetaSessionTotal}</div>
                        <div class="cell">${round.preetaOverallTotal}</div>
                    </div>
                    <div class="cell actions-cell">
                        <button class="btn-icon btn-edit" data-index="${actualIndex}" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" data-index="${actualIndex}" title="Delete">🗑️</button>
                    </div>
                </div>
            `;
        });

        tableHTML += `
                </div>
            </div>
        `;

        recentRoundsDiv.innerHTML = tableHTML;
    }

    // Export data as CSV
    exportCSV() {
        const csvContent = exportToCSV(this.tracker.rounds);

        if (!csvContent) {
            alert('No data to export!');
            return;
        }

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateCSVFilename();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Import CSV file
    importCSV(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const rounds = parseCSV(content);

                if (confirm(`This will replace all current data with ${rounds.length} rounds from the CSV file. Continue?`)) {
                    this.tracker.importRounds(rounds);
                    this.saveToStorage();
                    this.updateUI();
                    alert('CSV imported successfully!');
                }
            } catch (error) {
                alert('Error importing CSV file: ' + error.message);
                console.error(error);
            }
        };

        reader.readAsText(file);
    }

    // Delete a specific round
    deleteRound(index) {
        if (confirm('Are you sure you want to delete this round? This will recalculate all totals.')) {
            this.tracker.deleteRound(index);
            this.saveToStorage();
            this.updateUI();
        }
    }

    // Edit a specific round
    editRound(index) {
        const round = this.tracker.rounds[index];

        // Find the round row in the DOM
        const roundRows = document.querySelectorAll('.round-row');
        const reverseIndex = this.tracker.rounds.length - 1 - index;
        const roundRow = roundRows[reverseIndex];
        const roundNumber = index + 1;

        // Replace the round row with an editable form
        roundRow.innerHTML = `
            <div class="cell">${roundNumber}</div>
            <div class="cell">${round.session}</div>
            <div class="cell-group">
                <div class="cell">
                    <input type="number" class="edit-input" id="edit-mike-${index}" value="${round.mikeScore}" />
                </div>
                <div class="cell">${round.mikeSessionTotal}</div>
                <div class="cell">${round.mikeOverallTotal}</div>
            </div>
            <div class="cell-group">
                <div class="cell">
                    <input type="number" class="edit-input" id="edit-preeta-${index}" value="${round.preetaScore}" />
                </div>
                <div class="cell">${round.preetaSessionTotal}</div>
                <div class="cell">${round.preetaOverallTotal}</div>
            </div>
            <div class="cell actions-cell">
                <button class="btn-icon btn-save" data-index="${index}" title="Save">💾</button>
                <button class="btn-icon btn-cancel" data-index="${index}" title="Cancel">✖️</button>
            </div>
        `;

        document.getElementById(`edit-mike-${index}`).focus();
    }

    // Save edited round
    saveEditedRound(index) {
        const newMikeScore = parseInt(document.getElementById(`edit-mike-${index}`).value);
        const newPreetaScore = parseInt(document.getElementById(`edit-preeta-${index}`).value);

        try {
            this.tracker.editRound(index, newMikeScore, newPreetaScore);
            this.saveToStorage();
            this.updateUI();
        } catch (error) {
            alert(error.message);
        }
    }

    // Cancel editing
    cancelEdit() {
        this.updateUI();
    }

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
            if (confirm('Really sure? All your score history will be deleted.')) {
                this.tracker.clearAllData();
                this.saveToStorage();
                this.updateUI();
                alert('All data cleared!');
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CambioTrackerWeb();
});
