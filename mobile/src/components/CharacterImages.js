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

// Web CSS uses: clip-path: inset(5% 0 20% 0) with 200x420 dimensions
// This crops 5% from top (21px) and 20% from bottom (84px)
// Visible height = 420 - 21 - 84 = 315px, so visible ratio is 200:315

// For mobile: using 140px width, full height would be 294px (140 * 420/200)
// We crop 5% top = 14.7px and 20% bottom = 58.8px
// Visible height = 294 - 14.7 - 58.8 ≈ 220px

const IMAGE_WIDTH = 140;
const IMAGE_FULL_HEIGHT = 294;  // Full image height at this width (maintains 200:420 ratio)
const CROP_TOP_PERCENT = 0.05;
const CROP_BOTTOM_PERCENT = 0.20;
const CROP_TOP = IMAGE_FULL_HEIGHT * CROP_TOP_PERCENT;
const CROP_BOTTOM = IMAGE_FULL_HEIGHT * CROP_BOTTOM_PERCENT;
const VISIBLE_HEIGHT = IMAGE_FULL_HEIGHT - CROP_TOP - CROP_BOTTOM;

export default function CharacterImages({ angerLevels }) {
    const { mikeAnger, preetaAnger } = angerLevels;

    return (
        <View style={styles.container}>
            <View style={styles.characterWrapper}>
                <View style={styles.characterContainer}>
                    <Image
                        source={mikeImages[mikeAnger]}
                        style={styles.characterImage}
                        resizeMode="cover"
                    />
                </View>
            </View>
            <View style={styles.characterWrapper}>
                <View style={styles.characterContainer}>
                    <Image
                        source={preetaImages[preetaAnger]}
                        style={styles.characterImage}
                        resizeMode="cover"
                    />
                </View>
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
    characterWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    characterContainer: {
        width: IMAGE_WIDTH,
        height: VISIBLE_HEIGHT,
        overflow: 'hidden',
    },
    characterImage: {
        width: IMAGE_WIDTH,
        height: IMAGE_FULL_HEIGHT,
        marginTop: -CROP_TOP,  // Shift image up to crop from top
    },
});
