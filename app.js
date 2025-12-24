// Cambio Score Tracker Application
class CambioTracker {
    constructor() {
        this.rounds = [];
        this.currentSession = 1;
        this.loadData();
        this.initializeEventListeners();
        this.updateUI();
    }

    // Load data from localStorage
    loadData() {
        const savedData = localStorage.getItem('cambioScores');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.rounds = data.rounds || [];
            this.currentSession = data.currentSession || 1;
        }
    }

    // Save data to localStorage
    saveData() {
        const data = {
            rounds: this.rounds,
            currentSession: this.currentSession
        };
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
        this.saveData();
        this.updateUI();

        // Clear form
        document.getElementById('scoreForm').reset();
        document.getElementById('mikeScore').focus();
    }

    // Start a new session
    startNewSession() {
        if (confirm('Are you sure you want to start a new session?')) {
            this.currentSession++;
            this.saveData();
            this.updateUI();
        }
    }

    // Update the UI
    updateUI() {
        // Update session number
        document.getElementById('currentSession').textContent = this.currentSession;

        // Update totals
        let mikeSessionTotal = 0;
        let preetaSessionTotal = 0;
        let mikeOverallTotal = 0;
        let preetaOverallTotal = 0;

        if (this.rounds.length > 0) {
            const lastRound = this.rounds[this.rounds.length - 1];
            mikeOverallTotal = lastRound.mikeOverallTotal;
            preetaOverallTotal = lastRound.preetaOverallTotal;

            const currentSessionRounds = this.rounds.filter(r => r.session === this.currentSession);
            if (currentSessionRounds.length > 0) {
                const lastSessionRound = currentSessionRounds[currentSessionRounds.length - 1];
                mikeSessionTotal = lastSessionRound.mikeSessionTotal;
                preetaSessionTotal = lastSessionRound.preetaSessionTotal;
            }
        }

        document.getElementById('mikeSessionTotal').textContent = mikeSessionTotal;
        document.getElementById('preetaSessionTotal').textContent = preetaSessionTotal;
        document.getElementById('mikeOverallTotal').textContent = mikeOverallTotal;
        document.getElementById('preetaOverallTotal').textContent = preetaOverallTotal;

        // Calculate and update deltas
        const sessionDelta = mikeSessionTotal - preetaSessionTotal;
        const totalDelta = mikeOverallTotal - preetaOverallTotal;

        this.updateDelta('sessionDelta', sessionDelta);
        this.updateDelta('totalDelta', totalDelta);

        // Update recent rounds (show last 10)
        this.updateRecentRounds();
    }

    // Update historical rounds display
    updateRecentRounds() {
        const recentRoundsDiv = document.getElementById('recentRounds');

        if (this.rounds.length === 0) {
            recentRoundsDiv.innerHTML = '<div class="empty-state">No rounds yet. Add your first round above!</div>';
            return;
        }

        // Show all rounds in reverse order (newest first)
        const allRounds = [...this.rounds].reverse();

        recentRoundsDiv.innerHTML = allRounds.map((round, reverseIndex) => {
            const actualIndex = this.rounds.length - 1 - reverseIndex;
            return `
            <div class="round-item">
                <div class="round-session">S${round.session}</div>
                <div class="round-scores">
                    <span>M: ${round.mikeScore}</span>
                    <span>P: ${round.preetaScore}</span>
                </div>
                <div class="round-scores">
                    <span>M: ${round.mikeSessionTotal}</span>
                    <span>P: ${round.preetaSessionTotal}</span>
                </div>
                <div class="round-scores">
                    <span>M: ${round.mikeOverallTotal}</span>
                    <span>P: ${round.preetaOverallTotal}</span>
                </div>
                <div class="round-actions">
                    <button class="btn-edit" data-index="${actualIndex}">Edit</button>
                    <button class="btn-delete" data-index="${actualIndex}">Delete</button>
                </div>
            </div>
            `;
        }).join('');
    }

    // Update delta display
    updateDelta(elementId, deltaValue) {
        const element = document.getElementById(elementId);

        // Format the delta with absolute value and player name
        let displayValue;

        if (deltaValue > 0) {
            displayValue = `+${deltaValue} (Mike)`;
        } else if (deltaValue < 0) {
            displayValue = `+${Math.abs(deltaValue)} (Preeta)`;
        } else {
            displayValue = '0 (Tied)';
        }

        element.textContent = displayValue;
        element.className = 'delta-value';
    }

    // Export data as CSV
    exportCSV() {
        if (this.rounds.length === 0) {
            alert('No data to export!');
            return;
        }

        const headers = ['Session', 'Mike_Score', 'Preeta_Score', 'Mike_Session_Total', 'Preeta_Session_Total', 'Mike_Overall_Total', 'Preeta_Overall_Total'];

        const csvContent = [
            headers.join(','),
            ...this.rounds.map(round => [
                round.session,
                round.mikeScore,
                round.preetaScore,
                round.mikeSessionTotal,
                round.preetaSessionTotal,
                round.mikeOverallTotal,
                round.preetaOverallTotal
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cambio_scores_${new Date().toISOString().split('T')[0]}.csv`;
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
                const lines = content.split('\n');

                // Skip header line
                const dataLines = lines.slice(1).filter(line => line.trim());

                if (confirm(`This will replace all current data with ${dataLines.length} rounds from the CSV file. Continue?`)) {
                    this.rounds = dataLines.map(line => {
                        const [session, mikeScore, preetaScore, mikeSessionTotal, preetaSessionTotal, mikeOverallTotal, preetaOverallTotal] = line.split(',').map(val => parseInt(val.trim()));

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

                    // Set current session to the last session number + 1
                    if (this.rounds.length > 0) {
                        this.currentSession = this.rounds[this.rounds.length - 1].session + 1;
                    }

                    this.saveData();
                    this.updateUI();
                    alert('CSV imported successfully!');
                }
            } catch (error) {
                alert('Error importing CSV file. Please check the format.');
                console.error(error);
            }
        };

        reader.readAsText(file);
    }

    // Delete a specific round
    deleteRound(index) {
        if (confirm('Are you sure you want to delete this round? This will recalculate all totals.')) {
            // Remove the round
            this.rounds.splice(index, 1);

            // Recalculate all totals from scratch
            this.recalculateAllTotals();

            // Update current session to be the last session number + 1
            // If no rounds left, reset to 1
            if (this.rounds.length > 0) {
                const lastRound = this.rounds[this.rounds.length - 1];
                this.currentSession = lastRound.session + 1;
            } else {
                this.currentSession = 1;
            }

            this.saveData();
            this.updateUI();
        }
    }

    // Edit a specific round
    editRound(index) {
        const round = this.rounds[index];

        // Find the round item in the DOM
        const roundItems = document.querySelectorAll('.round-item');
        const allRounds = [...this.rounds].reverse();
        const reverseIndex = this.rounds.length - 1 - index;
        const roundItem = roundItems[reverseIndex];

        // Replace the round item with an editable form
        roundItem.innerHTML = `
            <div class="round-session">S${round.session}</div>
            <div class="round-edit-form">
                <input type="number" class="edit-input" id="edit-mike-${index}" value="${round.mikeScore}" />
                <input type="number" class="edit-input" id="edit-preeta-${index}" value="${round.preetaScore}" />
            </div>
            <div class="round-scores">
                <span>M: ${round.mikeSessionTotal}</span>
                <span>P: ${round.preetaSessionTotal}</span>
            </div>
            <div class="round-scores">
                <span>M: ${round.mikeOverallTotal}</span>
                <span>P: ${round.preetaOverallTotal}</span>
            </div>
            <div class="round-actions">
                <button class="btn-save" data-index="${index}">Save</button>
                <button class="btn-cancel" data-index="${index}">Cancel</button>
            </div>
        `;

        // Focus on the first input
        document.getElementById(`edit-mike-${index}`).focus();
    }

    // Save edited round
    saveEditedRound(index) {
        const newMikeScore = parseInt(document.getElementById(`edit-mike-${index}`).value);
        const newPreetaScore = parseInt(document.getElementById(`edit-preeta-${index}`).value);

        // Validate inputs
        if (isNaN(newMikeScore) || isNaN(newPreetaScore)) {
            alert('Please enter valid numbers');
            return;
        }

        // Update the round's individual scores
        this.rounds[index].mikeScore = newMikeScore;
        this.rounds[index].preetaScore = newPreetaScore;

        // Recalculate all totals from this point forward
        this.recalculateAllTotals();

        this.saveData();
        this.updateUI();
    }

    // Cancel editing
    cancelEdit() {
        // Just refresh the UI to restore the original view
        this.updateUI();
    }

    // Recalculate all session and overall totals from scratch
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

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
            if (confirm('Really sure? All your score history will be deleted.')) {
                this.rounds = [];
                this.currentSession = 1;
                this.saveData();
                this.updateUI();
                alert('All data cleared!');
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CambioTracker();
});
