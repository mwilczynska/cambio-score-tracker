import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CambioProvider, useCambio } from './src/context/CambioContext';
import MainTab from './src/screens/MainTab';
import StatsTab from './src/screens/StatsTab';
import DataTab from './src/screens/DataTab';

const Tab = createBottomTabNavigator();

const COLORS = {
    primary: '#902215',
    secondary: '#0b2943',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
};

const TAB_CONFIG = {
    Main: { icon: '🎮', label: 'Play' },
    Stats: { icon: '📊', label: 'Stats' },
    Data: { icon: '💾', label: 'Data' },
};

function CustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const config = TAB_CONFIG[route.name];

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[
                            styles.tabButton,
                            isFocused ? styles.tabButtonActive : styles.tabButtonInactive,
                        ]}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.tabIcon}>{config.icon}</Text>
                        <Text
                            style={[
                                styles.tabLabel,
                                isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                            ]}
                        >
                            {config.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function AppContent() {
    const { isLoading } = useCambio();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <StatusBar style="light" backgroundColor={COLORS.secondary} />
                <Tab.Navigator
                    tabBar={(props) => <CustomTabBar {...props} />}
                    screenOptions={{
                        headerShown: false,
                        animation: 'none',
                    }}
                >
                    <Tab.Screen name="Main" component={MainTab} />
                    <Tab.Screen name="Stats" component={StatsTab} />
                    <Tab.Screen name="Data" component={DataTab} />
                </Tab.Navigator>
            </SafeAreaView>
            <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']} />
        </View>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <CambioProvider>
                    <AppContent />
                </CambioProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondary,
    },
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.secondary,
    },
    bottomSafeArea: {
        backgroundColor: COLORS.secondary,
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
    // Custom tab bar styles
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 4,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginHorizontal: 4,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    tabButtonActive: {
        backgroundColor: COLORS.cardBackground,
    },
    tabButtonInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabIcon: {
        fontSize: 20,
        marginBottom: 2,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    tabLabelActive: {
        color: COLORS.primary,
    },
    tabLabelInactive: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
});
