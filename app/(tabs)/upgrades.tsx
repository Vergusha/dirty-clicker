import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGameState } from '@/constants/GameState';

export default function UpgradesScreen() {
  const {
    clicks,
    clickPower,
    clickPowerLevel,
    clickPowerCost,
    passiveIncome,
    passiveIncomeLevel,
    passiveIncomeCost,
    upgradeClickPower,
    upgradePassiveIncome
  } = useGameState();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Улучшения</Text>
      <Text style={styles.clicksCounter}>Доступно кликов: {clicks}</Text>
      
      <ScrollView style={styles.upgradesContainer}>
        {/* Click Power Upgrade */}
        <View style={styles.upgradeCard}>
          <View style={styles.upgradeInfo}>
            <Text style={styles.upgradeName}>Сила клика</Text>
            <Text style={styles.upgradeDescription}>
              Увеличивает силу клика на 1
            </Text>
            <Text style={styles.upgradeStats}>
              Текущий уровень: {clickPowerLevel} | Текущая сила: +{clickPower}
            </Text>
          </View>
          
          <Pressable
            style={[
              styles.upgradeButton,
              clicks < clickPowerCost && styles.disabledButton
            ]}
            onPress={upgradeClickPower}
            disabled={clicks < clickPowerCost}
          >
            <Text style={styles.upgradeButtonText}>
              Улучшить {clickPowerCost} 👆
            </Text>
          </Pressable>
        </View>

        {/* Passive Income Upgrade */}
        <View style={styles.upgradeCard}>
          <View style={styles.upgradeInfo}>
            <Text style={styles.upgradeName}>Пассивный доход</Text>
            <Text style={styles.upgradeDescription}>
              Добавляет +1 клик в секунду
            </Text>
            <Text style={styles.upgradeStats}>
              Текущий уровень: {passiveIncomeLevel} | Текущий доход: +{passiveIncome}/сек
            </Text>
          </View>
          
          <Pressable
            style={[
              styles.upgradeButton,
              clicks < passiveIncomeCost && styles.disabledButton
            ]}
            onPress={upgradePassiveIncome}
            disabled={clicks < passiveIncomeCost}
          >
            <Text style={styles.upgradeButtonText}>
              Улучшить {passiveIncomeCost} 👆
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
    marginBottom: 8,
    textAlign: 'center',
  },
  clicksCounter: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  upgradesContainer: {
    flex: 1,
  },
  upgradeCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  upgradeInfo: {
    marginBottom: 12,
  },
  upgradeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 8,
  },
  upgradeStats: {
    fontSize: 14,
    color: '#888888',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#1E3D1E',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});