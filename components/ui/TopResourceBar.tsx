import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useGameState } from '@/constants/GameState';
import { useLocalization } from '@/constants/localization/LocalizationContext';

interface TopResourceBarProps {
  // Remove the onSettingsPress prop
}

export default function TopResourceBar({}: TopResourceBarProps) {
  const { t } = useLocalization();
  const { dilithium, coins } = useGameState();

  return (
    <View style={styles.container}>
      {/* Dilithium Display */}
      <View style={styles.resourceItem}>
        <Image
          source={require('@/assets/images/dilithium.png')}
          style={styles.resourceIcon}
          resizeMode="contain"
        />
        <Text style={styles.resourceText}>{dilithium}</Text>
      </View>

      {/* Coins Display */}
      <View style={styles.resourceItem}>
        <Image
          source={require('@/assets/images/coin.png')}
          style={styles.resourceIcon}
          resizeMode="contain"
        />
        <Text style={styles.resourceText}>{coins}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 100,
    justifyContent: 'center',
  },
  resourceIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  resourceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Removed settingsButton and settingsIcon styles
});
