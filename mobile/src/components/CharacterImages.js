import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// Import all character images
const mikeImages = {
    neutral: require('../../assets/mike_neutral.png'),
    annoyed: require('../../assets/mike_annoyed.png'),
    angry: require('../../assets/mike_angry.png'),
};

const preetaImages = {
    neutral: require('../../assets/preeta_neutral.png'),
    annoyed: require('../../assets/preeta_annoyed.png'),
    angry: require('../../assets/preeta_angry.png'),
};

export default function CharacterImages({ angerLevels }) {
    const { mikeAnger, preetaAnger } = angerLevels;

    return (
        <View style={styles.container}>
            <View style={styles.characterContainer}>
                <Image
                    source={mikeImages[mikeAnger]}
                    style={styles.characterImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.characterContainer}>
                <Image
                    source={preetaImages[preetaAnger]}
                    style={styles.characterImage}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 16,
    },
    characterContainer: {
        flex: 1,
        alignItems: 'center',
    },
    characterImage: {
        width: 120,
        height: 200,
    },
});
