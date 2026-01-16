import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import { useCambioTracker } from '../hooks/useCambioTracker';
import { exportToCSV, parseCSV, generateCSVFilename } from '../shared/csvUtils';

import ScoreInput from '../components/ScoreInput';
import Statistics from '../components/Statistics';
import CharacterImages from '../components/CharacterImages';
import HistoricalRounds from '../components/HistoricalRounds';

export default function HomeScreen() {
    const {
        isLoading,
        rounds,
        currentSession,
        sessionTotals,
        overallTotals,
        sessionDelta,
        overallDelta,
        angerLevels,
        roundsReversed,
        formatDelta,
        addRound,
        deleteRound,
        startNewSession,
        clearAllData,
        importRounds,
    } = useCambioTracker();

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

    const handleExportCSV = async () => {
        const csvContent = exportToCSV(rounds);

        if (!csvContent) {
            Alert.alert('No Data', 'No data to export!');
            return;
        }

        try {
            const filename = generateCSVFilename();
            const fileUri = FileSystem.documentDirectory + filename;

            await FileSystem.writeAsStringAsync(fileUri, csvContent);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Success', `File saved to ${fileUri}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to export CSV: ' + error.message);
        }
    };

    const handleImportCSV = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/csv',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets[0];
            const content = await FileSystem.readAsStringAsync(file.uri);
            const parsedRounds = parseCSV(content);

            Alert.alert(
                'Import CSV',
                `This will replace all current data with ${parsedRounds.length} rounds from the CSV file. Continue?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Import',
                        onPress: async () => {
                            await importRounds(parsedRounds);
                            Alert.alert('Success', 'CSV imported successfully!');
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to import CSV: ' + error.message);
        }
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'Are you sure you want to clear ALL data? This cannot be undone!',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Really Sure?',
                            'All your score history will be deleted.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Delete Everything',
                                    style: 'destructive',
                                    onPress: async () => {
                                        await clearAllData();
                                        Alert.alert('Done', 'All data cleared!');
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#902215" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0b2943" />
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Cambio Score Tracker</Text>
                    <Text style={styles.sessionNumber}>Session: {currentSession}</Text>
                </View>

                {/* Character Images */}
                <CharacterImages angerLevels={angerLevels} />

                {/* Score Input */}
                <ScoreInput onSubmit={addRound} />

                {/* New Session Button */}
                <TouchableOpacity style={styles.newSessionButton} onPress={handleNewSession}>
                    <Text style={styles.newSessionButtonText}>Start New Session</Text>
                </TouchableOpacity>

                {/* Statistics */}
                <Statistics
                    sessionTotals={sessionTotals}
                    overallTotals={overallTotals}
                    sessionDelta={sessionDelta}
                    overallDelta={overallDelta}
                    formatDelta={formatDelta}
                />

                {/* Historical Rounds */}
                <HistoricalRounds
                    rounds={rounds}
                    roundsReversed={roundsReversed}
                    onDelete={deleteRound}
                />

                {/* Data Management */}
                <View style={styles.dataManagement}>
                    <Text style={styles.sectionTitle}>Data Management</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleExportCSV}>
                            <Text style={styles.secondaryButtonText}>Export CSV</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleImportCSV}>
                            <Text style={styles.secondaryButtonText}>Import CSV</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
                        <Text style={styles.dangerButtonText}>Clear All Data</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom padding */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0b2943',
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: '#0b2943',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    sessionNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f0ad4e',
    },
    newSessionButton: {
        backgroundColor: '#f0ad4e',
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
    dataManagement: {
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        color: '#0b2943',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#f0ad4e',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    dangerButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    dangerButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    bottomPadding: {
        height: 40,
    },
});
