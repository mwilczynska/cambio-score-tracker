import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Dimensions,
} from 'react-native';

import { useCambio } from '../context/CambioContext';
import ScoreInput from '../components/ScoreInput';
import CharacterImages from '../components/CharacterImages';

const backgroundImage = require('../../assets/background01.png');

export default function MainTab() {
    const {
        currentSession,
        sessionDelta,
        overallDelta,
        angerLevels,
        formatDelta,
        addRound,
        startNewSession,
    } = useCambio();

    const handleNewSession = () => {
        Alert.alert(
            'New Session',
            'Are you sure you want to start a new session?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Start', onPress: startNewSession },
            ]
        );
    };

    return (
        <View style={styles.backgroundContainer}>
            <Image
                source={backgroundImage}
                style={styles.backgroundImage}
                resizeMode="repeat"
            />
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Cambio Score Tracker</Text>
                    <Text style={styles.sessionNumber}>Session: {currentSession}</Text>
                </View>

                {/* Character Images */}
                <CharacterImages angerLevels={angerLevels} />

                {/* Score Input */}
                <ScoreInput onSubmit={addRound} showTitle={false} />

                {/* New Session Button */}
                <TouchableOpacity style={styles.newSessionButton} onPress={handleNewSession}>
                    <Text style={styles.newSessionButtonText}>Start New Session</Text>
                </TouchableOpacity>

                {/* Quick Stats - Deltas Only */}
                <View style={styles.statsCard}>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Session Delta</Text>
                            <Text style={styles.statValue}>{formatDelta(sessionDelta)}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Total Delta</Text>
                            <Text style={styles.statValue}>{formatDelta(overallDelta)}</Text>
                        </View>
                    </View>
                </View>

                {/* Bottom padding */}
                <View style={styles.bottomPadding} />
            </ScrollView>
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
    newSessionButton: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    newSessionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statsCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        marginHorizontal: 4,
        padding: 12,
        backgroundColor: 'rgba(11, 41, 67, 0.05)',
        borderRadius: 8,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    bottomPadding: {
        height: 40,
    },
});
