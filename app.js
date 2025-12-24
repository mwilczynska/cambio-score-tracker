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

        // Update recent rounds (show last 10)
        this.updateRecentRounds();
    }

    // Update recent rounds display
    updateRecentRounds() {
        const recentRoundsDiv = document.getElementById('recentRounds');

        if (this.rounds.length === 0) {
            recentRoundsDiv.innerHTML = '<div class="empty-state">No rounds yet. Add your first round above!</div>';
            return;
        }

        const recentRounds = this.rounds.slice(-10).reverse();

        recentRoundsDiv.innerHTML = recentRounds.map(round => `
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
            </div>
        `).join('');
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
