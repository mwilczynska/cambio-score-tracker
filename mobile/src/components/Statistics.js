import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Statistics({
    sessionTotals,
    overallTotals,
    sessionDelta,
    overallDelta,
    formatDelta
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Statistics</Text>

            <View style={styles.statsGrid}>
                <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.label}>Session Delta:</Text>
                        <Text style={styles.value}>{formatDelta(sessionDelta)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.label}>Total Delta:</Text>
                        <Text style={styles.value}>{formatDelta(overallDelta)}</Text>
                    </View>
                </View>

                <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.label}>Mike - Session:</Text>
                        <Text style={styles.value}>{sessionTotals.mikeSessionTotal}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.label}>Preeta - Session:</Text>
                        <Text style={styles.value}>{sessionTotals.preetaSessionTotal}</Text>
                    </View>
                </View>

                <View style={styles.statRow}>
                    <View style={[styles.statItem, styles.highlight]}>
                        <Text style={styles.label}>Mike - Overall:</Text>
                        <Text style={[styles.value, styles.highlightText]}>{overallTotals.mikeOverallTotal}</Text>
                    </View>
                    <View style={[styles.statItem, styles.highlight]}>
                        <Text style={styles.label}>Preeta - Overall:</Text>
                        <Text style={[styles.value, styles.highlightText]}>{overallTotals.preetaOverallTotal}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Colors matching web app
const COLORS = {
    primary: '#902215',
    secondary: '#0b2943',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#0b2943',
    textSecondary: '#902215',
};

const styles = StyleSheet.create({
    container: {
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
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: COLORS.textPrimary,
    },
    statsGrid: {
        gap: 12,
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
    highlight: {
        backgroundColor: 'rgba(11, 41, 67, 0.1)',
    },
    label: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    highlightText: {
        color: COLORS.primary,
    },
});
