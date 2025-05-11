import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Используем изображение bottom_panel.png как фон для нижней панели
export default function TabBarBackground() {
  return (
    <Image
      source={require('@/assets/images/bottom_panel.png')}
      style={styles.background}
      resizeMode="stretch"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});

export function useBottomTabOverflow() {
  return 0;
}
