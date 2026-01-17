import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function HistoricalRounds({ rounds, roundsReversed, onDelete, onEdit }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    if (rounds.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Historical Rounds</Text>
                <Text style={styles.emptyState}>No rounds yet. Add your first round above!</Text>
            </View>
        );
    }

    const handleDelete = (index) => {
        Alert.alert(
            'Delete Round',
            'Are you sure you want to delete this round? This will recalculate all totals.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        onDelete(index);
                        setSelectedIndex(null);
                    }
                },
            ]
        );
    };

    const handleRowPress = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historical Rounds</Text>

            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.smallCell]}>#</Text>
                <Text style={[styles.headerCell, styles.smallCell]}>Ses</Text>
                <View style={styles.playerGroup}>
                    <Text style={styles.playerHeader}>Mike</Text>
                    <View style={styles.subheaderRow}>
                        <Text style={styles.subheader}>Rnd</Text>
                        <Text style={styles.subheader}>Ses</Text>
                        <Text style={styles.subheader}>Tot</Text>
                    </View>
                </View>
                <View style={styles.playerGroup}>
                    <Text style={styles.playerHeader}>Preeta</Text>
                    <View style={styles.subheaderRow}>
                        <Text style={styles.subheader}>Rnd</Text>
                        <Text style={styles.subheader}>Ses</Text>
                        <Text style={styles.subheader}>Tot</Text>
                    </View>
                </View>
            </View>

            {/* Rounds */}
            <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                {roundsReversed.map((round, reverseIndex) => {
                    const actualIndex = rounds.length - 1 - reverseIndex;
                    const roundNumber = actualIndex + 1;
                    const isSelected = selectedIndex === actualIndex;

                    return (
                        <TouchableOpacity
                            key={actualIndex}
                            style={[styles.roundRow, isSelected && styles.selectedRow]}
                            onPress={() => handleRowPress(actualIndex)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.cell, styles.smallCell]}>{roundNumber}</Text>
                            <Text style={[styles.cell, styles.smallCell]}>{round.session}</Text>
                            <View style={styles.scoreGroup}>
                                <Text style={styles.scoreCell}>{round.mikeScore}</Text>
                                <Text style={styles.scoreCell}>{round.mikeSessionTotal}</Text>
                                <Text style={styles.scoreCell}>{round.mikeOverallTotal}</Text>
                            </View>
                            <View style={styles.scoreGroup}>
                                <Text style={styles.scoreCell}>{round.preetaScore}</Text>
                                <Text style={styles.scoreCell}>{round.preetaSessionTotal}</Text>
                                <Text style={styles.scoreCell}>{round.preetaOverallTotal}</Text>
                            </View>
                            {isSelected && (
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleDelete(actualIndex)}
                                    >
                                        <Text style={styles.actionIcon}>🗑️</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
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
    border: 'rgba(11, 41, 67, 0.15)',
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
        maxHeight: 400,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: COLORS.textPrimary,
    },
    emptyState: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        paddingVertical: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.secondary,
        paddingBottom: 8,
        marginBottom: 8,
    },
    headerCell: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    smallCell: {
        width: 30,
    },
    playerGroup: {
        flex: 1,
        alignItems: 'center',
    },
    playerHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    subheaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    subheader: {
        fontSize: 10,
        color: COLORS.textSecondary,
        flex: 1,
        textAlign: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        position: 'absolute',
        right: 8,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 4,
        padding: 4,
    },
    scrollView: {
        maxHeight: 280,
    },
    roundRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        position: 'relative',
    },
    selectedRow: {
        backgroundColor: 'rgba(11, 41, 67, 0.08)',
    },
    cell: {
        fontSize: 14,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    scoreGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    scoreCell: {
        fontSize: 14,
        color: COLORS.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    actionButton: {
        padding: 4,
    },
    actionIcon: {
        fontSize: 16,
    },
});
