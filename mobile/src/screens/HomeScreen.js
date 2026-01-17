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
    Image,
    Dimensions,
} from 'react-native';
import { File, Paths } from 'expo-file-system/next';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import { useCambioTracker } from '../hooks/useCambioTracker';
import { exportToCSV, parseCSV, generateCSVFilename } from '../shared/csvUtils';

import ScoreInput from '../components/ScoreInput';
import Statistics from '../components/Statistics';
import CharacterImages from '../components/CharacterImages';
import HistoricalRounds from '../components/HistoricalRounds';

const backgroundImage = require('../../assets/background01.png');

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
            const file = new File(Paths.cache, filename);

            await file.write(csvContent);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(file.uri);
            } else {
                Alert.alert('Success', `File saved to ${file.uri}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to export CSV: ' + error.message);
        }
    };

    const handleImportCSV = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            const pickedFile = result.assets[0];
            const file = new File(pickedFile.uri);
            const content = await file.text();
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
            </View>
        </SafeAreaView>
    );
}

// Colors matching web app (from styles.css :root)
const COLORS = {
    primary: '#902215',       // rgb(144, 34, 21)
    primaryHover: '#731b11',  // rgb(115, 27, 17)
    secondary: '#0b2943',     // rgb(11, 41, 67)
    secondaryHover: '#081f33', // rgb(8, 31, 51)
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#0b2943',
    textSecondary: '#902215',
    danger: '#902215',
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.secondary,
    },
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
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
    dataManagement: {
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        color: COLORS.textPrimary,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: COLORS.secondary,
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
        backgroundColor: COLORS.danger,
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
