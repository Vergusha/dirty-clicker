import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import SettingsModal from '@/components/SettingsModal';
import { useGameState } from '@/constants/GameState';
import {
  playAmbientMusic,
  playClickSound,
} from '@/constants/Sounds';

export default function HomeScreen() {
  const { clicks, clickPower, passiveIncome, addClicks } = useGameState();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [planetScale, setPlanetScale] = useState(1);

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
    
    // Анимация нажатия - планета немного уменьшается и возвращается к исходному размеру
    setPlanetScale(0.95);
    setTimeout(() => setPlanetScale(1), 150);
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
    <ImageBackground 
      source={require('@/assets/images/space.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.counter}>Кликов: {clicks}</Text>
        {passiveIncome > 0 && (
          <Text style={styles.passive}>+{passiveIncome} в секунду</Text>
        )}
        
        {/* Планета вместо кнопки клика */}
        <View style={styles.planetContainer}>
          <Pressable onPress={handleClick} style={styles.planetButton}>
            <Image 
              source={require('@/assets/images/planet_1.png')}
              style={[styles.planet, { transform: [{ scale: planetScale }] }]}
              resizeMode="contain"
            />
          </Pressable>
          {clickPower > 0 && (
            <Text style={styles.clickPowerText}>+{clickPower}</Text>
          )}
        </View>
        
        {/* Settings button */}
        <Pressable 
          style={styles.settingsButtonContainer}
          onPress={openSettings}
        >
          <Image 
            source={require('@/assets/images/settings_button.png')}
            style={styles.settingsButton}
            resizeMode="contain"
          />
        </Pressable>
        
        {/* Settings Modal */}
        <SettingsModal 
          visible={settingsVisible}
          onClose={closeSettings}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  counter: {
    fontSize: 36, 
    color: 'white', 
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  passive: {
    fontSize: 18,
    color: '#4CAF50',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  planetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  planetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
  },
  planet: {
    width: '100%',
    height: '100%',
  },
  clickPowerText: {
    position: 'absolute',
    bottom: -30,
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  settingsButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  settingsButton: {
    width: 40,
    height: 40,
  },
});
