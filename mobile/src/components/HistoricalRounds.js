import React, { useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput, Modal } from 'react-native';

// Memoized row component to prevent unnecessary re-renders
const RoundRow = memo(({ round, roundNumber, actualIndex, isSelected, onPress, onEdit, onDelete }) => {
    return (
        <TouchableOpacity
            style={[styles.roundRow, isSelected && styles.selectedRow]}
            onPress={() => onPress(actualIndex)}
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
                        onPress={() => onEdit(actualIndex)}
                    >
                        <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onDelete(actualIndex)}
                    >
                        <Text style={styles.actionIcon}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
});

// Separate Edit Modal component to isolate state changes
const EditModal = memo(({ visible, roundNumber, initialMikeScore, initialPreetaScore, onSave, onClose }) => {
    const [editMikeScore, setEditMikeScore] = useState('');
    const [editPreetaScore, setEditPreetaScore] = useState('');
    const [mikeIsNegative, setMikeIsNegative] = useState(false);
    const [preetaIsNegative, setPreetaIsNegative] = useState(false);

    // Reset state when modal opens with new values
    React.useEffect(() => {
        if (visible) {
            const mikeNeg = initialMikeScore < 0;
            const preetaNeg = initialPreetaScore < 0;
            setMikeIsNegative(mikeNeg);
            setPreetaIsNegative(preetaNeg);
            setEditMikeScore(String(Math.abs(initialMikeScore)));
            setEditPreetaScore(String(Math.abs(initialPreetaScore)));
        }
    }, [visible, initialMikeScore, initialPreetaScore]);

    const handleSave = () => {
        const mikeAbs = parseInt(editMikeScore) || 0;
        const preetaAbs = parseInt(editPreetaScore) || 0;
        const mike = mikeIsNegative ? -mikeAbs : mikeAbs;
        const preeta = preetaIsNegative ? -preetaAbs : preetaAbs;
        onSave(mike, preeta);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Round {roundNumber}</Text>

                    <View style={styles.modalInputRow}>
                        <View style={styles.modalInputGroup}>
                            <Text style={styles.modalLabel}>Mike's Score</Text>
                            <View style={styles.inputWithToggle}>
                                <TouchableOpacity
                                    style={[styles.signToggle, mikeIsNegative && styles.signToggleActive]}
                                    onPress={() => setMikeIsNegative(!mikeIsNegative)}
                                >
                                    <Text style={[styles.signToggleText, mikeIsNegative && styles.signToggleTextActive]}>
                                        {mikeIsNegative ? '−' : '+'}
                                    </Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.modalInputWithToggle}
                                    value={editMikeScore}
                                    onChangeText={setEditMikeScore}
                                    keyboardType="numeric"
                                    placeholder="0"
                                />
                            </View>
                        </View>
                        <View style={styles.modalInputGroup}>
                            <Text style={styles.modalLabel}>Preeta's Score</Text>
                            <View style={styles.inputWithToggle}>
                                <TouchableOpacity
                                    style={[styles.signToggle, preetaIsNegative && styles.signToggleActive]}
                                    onPress={() => setPreetaIsNegative(!preetaIsNegative)}
                                >
                                    <Text style={[styles.signToggleText, preetaIsNegative && styles.signToggleTextActive]}>
                                        {preetaIsNegative ? '−' : '+'}
                                    </Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.modalInputWithToggle}
                                    value={editPreetaScore}
                                    onChangeText={setEditPreetaScore}
                                    keyboardType="numeric"
                                    placeholder="0"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

export default function HistoricalRounds({ rounds, roundsReversed, onDelete, onEdit }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingRound, setEditingRound] = useState({ index: null, mikeScore: 0, preetaScore: 0 });

    // All hooks must be called before any early returns
    const handleDelete = useCallback((index) => {
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
    }, [onDelete]);

    const handleEdit = useCallback((index) => {
        const round = rounds[index];
        if (round) {
            setEditingRound({
                index,
                mikeScore: round.mikeScore,
                preetaScore: round.preetaScore
            });
            setEditModalVisible(true);
        }
    }, [rounds]);

    const handleSaveEdit = useCallback((mike, preeta) => {
        onEdit(editingRound.index, mike, preeta);
        setEditModalVisible(false);
        setSelectedIndex(null);
    }, [editingRound.index, onEdit]);

    const handleRowPress = useCallback((index) => {
        setSelectedIndex(prev => prev === index ? null : index);
    }, []);

    const handleCloseModal = useCallback(() => {
        setEditModalVisible(false);
    }, []);

    // Early return AFTER all hooks are called
    if (rounds.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Historical Rounds</Text>
                <Text style={styles.emptyState}>No rounds yet. Add your first round above!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historical Rounds ({rounds.length})</Text>

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

            {/* Virtualized Rounds List - shows ~10 rows, scrolls through all */}
            <FlatList
                data={roundsReversed}
                renderItem={({ item: round, index: reverseIndex }) => {
                    const actualIndex = rounds.length - 1 - reverseIndex;
                    const roundNumber = actualIndex + 1;
                    const isSelected = selectedIndex === actualIndex;

                    return (
                        <RoundRow
                            round={round}
                            roundNumber={roundNumber}
                            actualIndex={actualIndex}
                            isSelected={isSelected}
                            onPress={handleRowPress}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    );
                }}
                keyExtractor={(item, index) => String(rounds.length - 1 - index)}
                style={styles.roundsList}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => ({
                    length: 40,
                    offset: 40 * index,
                    index,
                })}
                nestedScrollEnabled={true}
            />

            {/* Edit Modal - separate component to prevent list re-renders */}
            <EditModal
                visible={editModalVisible}
                roundNumber={editingRound.index !== null ? editingRound.index + 1 : ''}
                initialMikeScore={editingRound.mikeScore}
                initialPreetaScore={editingRound.preetaScore}
                onSave={handleSaveEdit}
                onClose={handleCloseModal}
            />
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
        width: 36,
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
    roundsList: {
        maxHeight: 400,
    },
    roundRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        position: 'relative',
        height: 40,
    },
    selectedRow: {
        backgroundColor: 'rgba(11, 41, 67, 0.08)',
    },
    cell: {
        fontSize: 11,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    scoreGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    scoreCell: {
        fontSize: 11,
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
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 20,
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalInputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalInputGroup: {
        flex: 1,
        marginHorizontal: 4,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    modalInput: {
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    inputWithToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signToggle: {
        width: 36,
        height: 44,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 8,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(11, 41, 67, 0.05)',
    },
    signToggleActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    signToggleText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    signToggleTextActive: {
        color: '#fff',
    },
    modalInputWithToggle: {
        flex: 1,
        borderWidth: 2,
        borderLeftWidth: 0,
        borderColor: COLORS.border,
        borderRadius: 8,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        padding: 10,
        fontSize: 18,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: 'rgba(11, 41, 67, 0.1)',
    },
    cancelButtonText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
