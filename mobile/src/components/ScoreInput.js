import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ScoreInput({ onSubmit, showTitle = true }) {
    const [mikeScore, setMikeScore] = useState('');
    const [preetaScore, setPreetaScore] = useState('');

    const toggleSign = (value, setValue) => {
        if (value === '' || value === '0') return;
        if (value.startsWith('-')) {
            setValue(value.substring(1));
        } else {
            setValue('-' + value);
        }
    };

    const handleSubmit = () => {
        const mike = parseInt(mikeScore);
        const preeta = parseInt(preetaScore);

        if (isNaN(mike) || isNaN(preeta)) {
            Alert.alert('Invalid Input', 'Please enter valid numbers for both scores');
            return;
        }

        onSubmit(mike, preeta);
        setMikeScore('');
        setPreetaScore('');
    };

    return (
        <View style={styles.container}>
            {showTitle && <Text style={styles.title}>Add New Round</Text>}

            <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mike's Score</Text>
                    <View style={styles.inputWithToggle}>
                        <TextInput
                            style={styles.input}
                            value={mikeScore}
                            onChangeText={setMikeScore}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => toggleSign(mikeScore, setMikeScore)}
                        >
                            <Text style={styles.toggleButtonText}>+/-</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preeta's Score</Text>
                    <View style={styles.inputWithToggle}>
                        <TextInput
                            style={styles.input}
                            value={preetaScore}
                            onChangeText={setPreetaScore}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => toggleSign(preetaScore, setPreetaScore)}
                        >
                            <Text style={styles.toggleButtonText}>+/-</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Add New Round</Text>
            </TouchableOpacity>
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
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    inputGroup: {
        flex: 1,
        marginHorizontal: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    inputWithToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'rgba(11, 41, 67, 0.15)',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        color: COLORS.textPrimary,
    },
    toggleButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 8,
    },
    toggleButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
