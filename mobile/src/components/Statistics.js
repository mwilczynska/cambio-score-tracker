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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
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
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        color: '#0b2943',
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
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    highlight: {
        backgroundColor: '#e8f4f8',
    },
    label: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0b2943',
    },
    highlightText: {
        color: '#902215',
    },
});
