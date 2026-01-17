import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
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

function TabIcon({ name, focused }) {
    const icons = {
        Main: focused ? '🎮' : '🎮',
        Stats: focused ? '📊' : '📊',
        Data: focused ? '💾' : '💾',
    };
    return <Text style={{ fontSize: 24 }}>{icons[name]}</Text>;
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
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="light" backgroundColor={COLORS.secondary} />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name={route.name} focused={focused} />
                    ),
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.secondary,
                    tabBarStyle: {
                        backgroundColor: COLORS.cardBackground,
                        borderTopColor: 'rgba(11, 41, 67, 0.15)',
                        paddingTop: 5,
                        height: 60,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                        marginBottom: 5,
                    },
                })}
            >
                <Tab.Screen
                    name="Main"
                    component={MainTab}
                    options={{ tabBarLabel: 'Play' }}
                />
                <Tab.Screen
                    name="Stats"
                    component={StatsTab}
                    options={{ tabBarLabel: 'Stats' }}
                />
                <Tab.Screen
                    name="Data"
                    component={DataTab}
                    options={{ tabBarLabel: 'Data' }}
                />
            </Tab.Navigator>
        </SafeAreaView>
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
    safeArea: {
        flex: 1,
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
});
