import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';

import { useCambio } from '../context/CambioContext';
import Statistics from '../components/Statistics';
import HistoricalRounds from '../components/HistoricalRounds';

const backgroundImage = require('../../assets/background01.png');

export default function StatsTab() {
    const {
        rounds,
        currentSession,
        sessionTotals,
        overallTotals,
        sessionDelta,
        overallDelta,
        roundsReversed,
        formatDelta,
        deleteRound,
        editRound,
    } = useCambio();

    return (
        <View style={styles.backgroundContainer}>
            <Image
                source={backgroundImage}
                style={styles.backgroundImage}
                resizeMode="repeat"
            />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Cambio Score Tracker</Text>
                    <Text style={styles.sessionNumber}>Session: {currentSession}</Text>
                </View>

                {/* Statistics */}
                <Statistics
                    sessionTotals={sessionTotals}
                    overallTotals={overallTotals}
                    sessionDelta={sessionDelta}
                    overallDelta={overallDelta}
                    formatDelta={formatDelta}
                />

                {/* Historical Rounds - uses FlatList internally for virtualization */}
                <HistoricalRounds
                    rounds={rounds}
                    roundsReversed={roundsReversed}
                    onDelete={deleteRound}
                    onEdit={editRound}
                />
            </View>
        </View>
    );
}

const COLORS = {
    primary: '#902215',
    secondary: '#0b2943',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#0b2943',
    textSecondary: '#902215',
};

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 2,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    sessionNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
});
