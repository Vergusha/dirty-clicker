import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import CustomTabBar from '@/components/CustomTabBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#999999',
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Игра',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('@/assets/images/game.png')} 
              style={[
                styles.tabIcon,
                { opacity: focused ? 1 : 0.7 }
              ]} 
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upgrades"
        options={{
          title: 'Улучшения',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('@/assets/images/spaceship.png')} 
              style={[
                styles.tabIcon,
                { opacity: focused ? 1 : 0.7 }
              ]} 
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 28,
    height: 28,
  },
});
