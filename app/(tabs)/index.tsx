import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useGameState } from '@/constants/GameState';

export default function HomeScreen() {
  const { clicks, clickPower, passiveIncome, addClicks } = useGameState();

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Кликов: {clicks}</Text>
      {passiveIncome > 0 && (
        <Text style={styles.passive}>+{passiveIncome} в секунду</Text>
      )}
      <Pressable 
        style={styles.button} 
        onPress={() => addClicks(clickPower)}
      >
        <Text style={styles.buttonText}>Клик! (+{clickPower})</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212',
  },
  counter: {
    fontSize: 36, 
    color: 'white', 
    marginBottom: 8,
  },
  passive: {
    fontSize: 18,
    color: '#4CAF50',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 20, 
    paddingHorizontal: 40, 
    borderRadius: 10,
  },
  buttonText: {
    color: 'white', 
    fontSize: 24,
  },
});
