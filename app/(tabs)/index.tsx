import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import SettingsModal from '@/components/SettingsModal';
import { useGameState } from '@/constants/GameState';
import {
  playAmbientMusic,
  playClickSound,
} from '@/constants/Sounds';

export default function HomeScreen() {
  const { clicks, clickPower, passiveIncome, addClicks } = useGameState();
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Initialize and start ambient music when the component mounts
  useEffect(() => {
    // Start playing ambient music when the game screen loads
    const initializeMusic = async () => {
      await playAmbientMusic();
    };
    
    initializeMusic();
  }, []);

  // Function to handle button click with sound
  const handleClick = () => {
    playClickSound();
    addClicks(clickPower);
  };
  
  // Function to open settings modal
  const openSettings = () => {
    setSettingsVisible(true);
  };
  
  // Function to close settings modal
  const closeSettings = () => {
    setSettingsVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Кликов: {clicks}</Text>
      {passiveIncome > 0 && (
        <Text style={styles.passive}>+{passiveIncome} в секунду</Text>
      )}
      <Pressable 
        style={styles.button} 
        onPress={handleClick}
      >
        <Text style={styles.buttonText}>Клик! (+{clickPower})</Text>
      </Pressable>
      
      {/* Settings button */}
      <Pressable 
        style={styles.settingsButton}
        onPress={openSettings}
      >
        <MaterialIcons name="settings" size={24} color="white" />
      </Pressable>
      
      {/* Settings Modal */}
      <SettingsModal 
        visible={settingsVisible}
        onClose={closeSettings}
      />
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
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#333333',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
