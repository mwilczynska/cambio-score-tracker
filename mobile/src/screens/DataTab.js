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
import { File, Paths } from 'expo-file-system/next';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import { useCambio } from '../context/CambioContext';
import { exportToCSV, parseCSV, generateCSVFilename } from '../shared/csvUtils';

const backgroundImage = require('../../assets/background01.png');

export default function DataTab() {
    const {
        rounds,
        clearAllData,
        importRounds,
    } = useCambio();

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

    return (
        <View style={styles.backgroundContainer}>
            <Image
                source={backgroundImage}
                style={styles.backgroundImage}
                resizeMode="repeat"
            />
            <ScrollView style={styles.container}>
                {/* Data Management */}
                <View style={styles.dataManagement}>
                    <Text style={styles.sectionTitle}>Data Management</Text>

                    <Text style={styles.infoText}>
                        Total rounds recorded: {rounds.length}
                    </Text>

                    <View style={styles.buttonGroup}>
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
    );
}

const COLORS = {
    primary: '#902215',
    secondary: '#0b2943',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#0b2943',
    textSecondary: '#902215',
    danger: '#902215',
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
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: COLORS.textPrimary,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonGroup: {
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
