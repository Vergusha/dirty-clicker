import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import AlienDialog from '@/components/AlienDialog';
import SettingsModal from '@/components/SettingsModal';
import { useGameState } from '@/constants/GameState';
import { useLocalization } from '@/constants/localization/LocalizationContext';
import {
  playAmbientMusic,
  playClickSound,
  playUpgradeSound,
} from '@/constants/Sounds';

// Get window dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Constants for meteor
const METEOR_SIZE = 60;
const METEOR_INTERVAL = 3 * 60 * 1000; // 3 minutes in milliseconds
const METEOR_ANIMATION_SPEED = 5; // pixels per frame
const METEOR_CHECK_INTERVAL = 5000; // Check every 5 seconds if it's time to show a meteor
const BOTTOM_SAFE_AREA = 120; // Safe area to avoid bottom tab bar

export default function HomeScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { t } = useLocalization();
  const { 
    dilithium, 
    clickPower, 
    passiveIncome, 
    addDilithium, 
    firstPassiveUpgradeShown, 
    setFirstPassiveUpgradeShown 
  } = useGameState();
  
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [planetScale, setPlanetScale] = useState(1);
  const [alienDialogVisible, setAlienDialogVisible] = useState(false);
  
  // Meteor state
  const [meteorVisible, setMeteorVisible] = useState(false);
  const [meteorDirection, setMeteorDirection] = useState('left-to-right'); // or 'right-to-left'
  const [lastMeteorTime, setLastMeteorTime] = useState(Date.now() - METEOR_INTERVAL + 10000); // Show first meteor after 10 seconds
  const meteorPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [rewardText, setRewardText] = useState('');
  const [showReward, setShowReward] = useState(false);
  const rewardOpacity = useRef(new Animated.Value(0)).current;

  // Check for first passive upgrade tutorial
  useEffect(() => {
    // If player has passive income but hasn't seen the tutorial yet, show it
    if (passiveIncome > 0 && !firstPassiveUpgradeShown) {
      // Short delay to allow the screen to fully load
      const timer = setTimeout(() => {
        setAlienDialogVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [passiveIncome, firstPassiveUpgradeShown]);

  // Initialize and start ambient music when the component mounts
  useEffect(() => {
    // Start playing ambient music when the game screen loads
    const initializeMusic = async () => {
      await playAmbientMusic();
    };
    
    initializeMusic();
  }, []);

  // Check if it's time to show a meteor
  useEffect(() => {
    const checkMeteorInterval = setInterval(() => {
      if (!meteorVisible && Date.now() - lastMeteorTime >= METEOR_INTERVAL) {
        showMeteor();
      }
    }, METEOR_CHECK_INTERVAL);

    return () => clearInterval(checkMeteorInterval);
  }, [meteorVisible, lastMeteorTime]);

  // Animate meteor when visible
  useEffect(() => {
    let animationFrameId: number;

    if (meteorVisible) {
      const animateMeteor = () => {
        // Get current position
        const currentX = meteorPosition.x._value;

        // Calculate next position based on direction
        let nextX;
        if (meteorDirection === 'left-to-right') {
          nextX = currentX + METEOR_ANIMATION_SPEED;
          
          // Check if meteor is off-screen
          if (nextX > windowWidth + METEOR_SIZE) {
            setMeteorVisible(false);
            return;
          }
        } else {
          nextX = currentX - METEOR_ANIMATION_SPEED;
          
          // Check if meteor is off-screen
          if (nextX < -METEOR_SIZE) {
            setMeteorVisible(false);
            return;
          }
        }

        // Update position
        meteorPosition.setValue({ x: nextX, y: meteorPosition.y._value });
        
        // Continue animation
        animationFrameId = requestAnimationFrame(animateMeteor);
      };

      animationFrameId = requestAnimationFrame(animateMeteor);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [meteorVisible, meteorDirection]);

  // Show meteor
  const showMeteor = () => {
    // Random direction
    const direction = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left';
    setMeteorDirection(direction);

    // Random Y position (avoiding bottom tab bar)
    const maxY = windowHeight - METEOR_SIZE - BOTTOM_SAFE_AREA;
    const randomY = Math.random() * (maxY * 0.7) + 100; // Keep meteor in top 70% of usable area, and below top bar

    // Set initial X position based on direction
    const initialX = direction === 'left-to-right' ? -METEOR_SIZE : windowWidth + METEOR_SIZE;
    
    // Set position
    meteorPosition.setValue({ x: initialX, y: randomY });
    
    // Show meteor
    setMeteorVisible(true);
    
    // Update last meteor time
    setLastMeteorTime(Date.now());
  };

  // Handle meteor click
  const handleMeteorClick = () => {
    playUpgradeSound();
    setMeteorVisible(false);
    
    // Calculate reward (20x passive income)
    const reward = passiveIncome * 20;
    
    // Add reward
    addDilithium(reward);
    
    // Show reward text
    setRewardText(`+${reward}`);
    setShowReward(true);
    rewardOpacity.setValue(1);
    
    // Animate and hide reward text
    Animated.timing(rewardOpacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setShowReward(false);
    });
  };

  // Handle alien dialog close
  const handleAlienDialogClose = () => {
    setAlienDialogVisible(false);
    setFirstPassiveUpgradeShown(true);
  };

  // Function to handle button click with sound
  const handleClick = () => {
    playClickSound();
    addDilithium(clickPower);
    
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
        <View style={styles.resourceContainer}>
          <Image
            source={require('@/assets/images/dilithium.png')}
            style={styles.dilithiumIcon}
            resizeMode="contain"
          />
          <Text style={styles.counter}>{t('dilithium')}: {dilithium}</Text>
        </View>
        
        {passiveIncome > 0 && (
          <Text style={styles.passive}>+{passiveIncome} {t('perSecond')}</Text>
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
        
        {/* Meteor */}
        {meteorVisible && (
          <Animated.View
            style={[
              styles.meteorContainer,
              {
                left: meteorPosition.x,
                top: meteorPosition.y,
              }
            ]}
          >
            <Pressable onPress={handleMeteorClick} style={styles.meteorPressable}>
              <Image 
                source={require('@/assets/images/meteor.png')} 
                style={[
                  styles.meteor,
                  { transform: [{ rotate: meteorDirection === 'left-to-right' ? '45deg' : '-45deg' }] }
                ]} 
                resizeMode="contain"
              />
            </Pressable>
          </Animated.View>
        )}
        
        {/* Reward notification */}
        {showReward && (
          <Animated.Text style={[styles.rewardText, { opacity: rewardOpacity }]}>
            {rewardText}
          </Animated.Text>
        )}
        
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
        
        {/* Alien Tutorial Dialog */}
        <AlienDialog 
          visible={alienDialogVisible}
          onClose={handleAlienDialogClose}
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
  resourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dilithiumIcon: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  counter: {
    fontSize: 36, 
    color: 'white',
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
  meteorContainer: {
    position: 'absolute',
    width: METEOR_SIZE,
    height: METEOR_SIZE,
  },
  meteorPressable: {
    width: METEOR_SIZE,
    height: METEOR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meteor: {
    width: METEOR_SIZE,
    height: METEOR_SIZE,
  },
  rewardText: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    top: '40%',
  },
});
