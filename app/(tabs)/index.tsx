import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import AlienDialog from '@/components/AlienDialog';
import SettingsModal from '@/components/SettingsModal';
import TradingStationModal from '@/components/TradingStationModal';
import TopResourceBar from '@/components/ui/TopResourceBar';
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
    coins, 
    clickPower, 
    passiveIncome, 
    addDilithium, 
    firstPassiveUpgradeShown, 
    setFirstPassiveUpgradeShown,
    tradingStationVisible,
    setTradingStationVisible
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
      // Only check for meteors if player has passive income
      if (!meteorVisible && passiveIncome > 0 && Date.now() - lastMeteorTime >= METEOR_INTERVAL) {
        showMeteor();
      }
    }, METEOR_CHECK_INTERVAL);

    return () => clearInterval(checkMeteorInterval);
  }, [meteorVisible, lastMeteorTime, passiveIncome]); // Add passiveIncome as dependency

  // Animate meteor when visible
  useEffect(() => {
    let animationFrameId: number;

    if (meteorVisible) {
      const animateMeteor = () => {
        // Create local variables to track position
        let currentX = 0;
        let currentY = 0;
        
        // Get current position using listeners
        const xListener = meteorPosition.x.addListener(value => { currentX = value.value; });
        const yListener = meteorPosition.y.addListener(value => { currentY = value.value; });
        
        // Calculate next position based on direction
        let nextX;
        if (meteorDirection === 'left-to-right') {
          nextX = currentX + METEOR_ANIMATION_SPEED;
          
          // Check if meteor is off-screen on the right
          if (nextX > windowWidth + METEOR_SIZE) {
            meteorPosition.x.removeListener(xListener);
            meteorPosition.y.removeListener(yListener);
            setMeteorVisible(false);
            return;
          }
        } else {
          nextX = currentX - METEOR_ANIMATION_SPEED;
          
          // Check if meteor is off-screen on the left
          if (nextX < -METEOR_SIZE * 1.5) {
            meteorPosition.x.removeListener(xListener);
            meteorPosition.y.removeListener(yListener);
            setMeteorVisible(false);
            return;
          }
        }

        // Update position
        meteorPosition.setValue({ 
          x: nextX, 
          y: currentY
        });
        
        // Remove listeners to prevent memory leaks
        meteorPosition.x.removeListener(xListener);
        meteorPosition.y.removeListener(yListener);
        
        // Continue animation
        animationFrameId = requestAnimationFrame(animateMeteor);
      };

      // Start animation
      animationFrameId = requestAnimationFrame(animateMeteor);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [meteorVisible, meteorDirection, meteorPosition, windowWidth]);

  // Show meteor
  const showMeteor = () => {
    // Only show meteors if player has passive income
    if (passiveIncome <= 0) {
      return;
    }
    
    // Random direction
    const direction = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left';
    setMeteorDirection(direction);

    // Random Y position (avoiding bottom tab bar and top area)
    // Keep meteor in middle 60% of usable area, well below top bar and above bottom tab
    const minY = windowHeight * 0.2; // At least 20% from the top
    const maxY = windowHeight * 0.8 - BOTTOM_SAFE_AREA; // At most 80% from the top, minus tab bar
    const randomY = Math.random() * (maxY - minY) + minY; 

    // Set initial X position based on direction, ensuring it's completely off-screen
    const initialX = direction === 'left-to-right' ? 
      -METEOR_SIZE * 1.5 : // Completely off-screen on the left
      windowWidth + (METEOR_SIZE * 0.5); // Completely off-screen on the right
    
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
    
    // Calculate reward (20x passive income), with a minimum value of 10
    const baseReward = passiveIncome * 20;
    const reward = Math.max(baseReward, 10); // Ensure minimum reward of 10
    
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

  // Function to toggle trading station
  const toggleTradingStation = () => {
    setTradingStationVisible(true);
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/space.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Top Resource Bar */}
        <TopResourceBar />
        
        {/* Settings button positioned below the top bar */}
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
        
        {/* Trading Station Button */}
        <Pressable 
          style={styles.tradingStationButton}
          onPress={toggleTradingStation}
        >
          <Image 
            source={require('@/assets/images/trading_station.png')}
            style={styles.tradingStationImage}
            resizeMode="contain"
          />
        </Pressable>
        
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
        
        {/* Trading Station Modal */}
        <TradingStationModal
          visible={tradingStationVisible}
          onClose={() => setTradingStationVisible(false)}
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
  tradingStationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tradingStationImage: {
    width: '100%',
    height: '100%',
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
  settingsButtonContainer: {
    position: 'absolute',
    top: 100, // Position below the top bar
    right: 20, // Position on the right side
    zIndex: 5,
  },
  settingsButton: {
    width: 40,
    height: 40,
  },
});
