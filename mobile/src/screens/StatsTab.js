import React from 'react';
import {
    View,
    ScrollView,
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
            <ScrollView style={styles.container}>
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
                    onEdit={editRound}
                />

                {/* Bottom padding */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
}

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
    bottomPadding: {
        height: 40,
    },
});
