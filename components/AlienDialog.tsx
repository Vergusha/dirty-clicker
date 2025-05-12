import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { useLocalization } from '@/constants/localization/LocalizationContext';

// Get window dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Dialog step type
interface DialogStep {
  speaker: 'alien' | 'player';
  text: string;
}

// Component props
interface AlienDialogProps {
  visible: boolean;
  onClose: () => void;
}

export default function AlienDialog({ visible, onClose }: AlienDialogProps) {
  const { t, translations } = useLocalization();
  
  // Animation values
  const spaceshipScale = useRef(new Animated.Value(0.1)).current;
  const spaceshipPosition = useRef(new Animated.ValueXY({ x: 0, y: windowHeight/2 })).current;
  const dialogOpacity = useRef(new Animated.Value(0)).current;
  const animationCompleted = useRef(false);

  // Dialog state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Use the dialogSteps directly from translations to ensure proper typing
  const dialogSteps: DialogStep[] = translations.dialogSteps;
  
  // Log dialog steps for debugging
  useEffect(() => {
    if (visible) {
      console.log("Dialog steps:", JSON.stringify(dialogSteps));
    }
  }, [visible, dialogSteps]);
  
  // Reset animation when visibility changes
  useEffect(() => {
    if (visible) {
      // Reset animation state
      animationCompleted.current = false;
      spaceshipScale.setValue(0.1);
      spaceshipPosition.setValue({ x: 0, y: windowHeight/2 });
      dialogOpacity.setValue(0);
      setCurrentStep(0);
      setDialogVisible(false);
    }
  }, [visible]);

  // Start animation after component is mounted and stable
  useEffect(() => {
    if (visible && !animationCompleted.current) {
      // Mark as completed to prevent re-triggering
      animationCompleted.current = true;
      
      // Use timeout to ensure this runs after render is complete
      const timer = setTimeout(() => {
        // Spaceship approaches animation
        Animated.sequence([
          // Wait a bit before starting
          Animated.delay(500),
          
          // Spaceship approaches
          Animated.parallel([
            // Scale up
            Animated.timing(spaceshipScale, {
              toValue: 0.8, // Уменьшаем максимальный масштаб с 1.0 до 0.8
              duration: 2000,
              useNativeDriver: true,
            }),
            
            // Move to center under dialog
            Animated.timing(spaceshipPosition.y, {
              toValue: windowHeight * 0.48, // Немного ниже от диалога
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          
          // Show dialog
          Animated.timing(dialogOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Safe state update via timeout to avoid React state update during render
          setTimeout(() => {
            setDialogVisible(true);
          }, 0);
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [visible, spaceshipScale, spaceshipPosition, dialogOpacity]);
  
  // Memoize the advance dialog function to avoid recreating it on each render
  const advanceDialog = useCallback(() => {
    if (dialogSteps && currentStep < dialogSteps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      // End of dialog, animate spaceship leaving
      setDialogVisible(false);
      
      Animated.sequence([
        // Hide dialog
        Animated.timing(dialogOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        
        // Spaceship leaves
        Animated.parallel([
          // Scale down
          Animated.timing(spaceshipScale, {
            toValue: 0.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          
          // Move back to planet
          Animated.timing(spaceshipPosition.y, {
            toValue: windowHeight/2,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Use timeout to ensure this runs outside of any render cycle
        setTimeout(() => {
          onClose();
        }, 0);
      });
    }
  }, [currentStep, dialogOpacity, dialogSteps, onClose, spaceshipPosition, spaceshipScale]);
  
  // No render if not visible
  if (!visible) return null;

  // Safe check to prevent errors if dialogSteps is undefined
  if (!dialogSteps || !Array.isArray(dialogSteps) || dialogSteps.length === 0) {
    return null;
  }
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none" // Changed from fade to none to avoid potential animation conflicts
    >
      <View style={styles.container}>
        {/* Dialog */}
        <Animated.View style={[styles.dialogContainer, { opacity: dialogOpacity }]}>
          <Image
            source={require('@/assets/images/bubble_message.png')}
            style={[
              styles.dialogBubble, 
              {
                transform: [{ scaleX: -1 }]
              }
            ]}
            resizeMode="stretch"
          />
          
          {dialogVisible && dialogSteps && dialogSteps[currentStep] && (
            <>
              <View style={styles.dialogContent}>
                {/* Speaker avatar */}
                <Image
                  source={
                    dialogSteps[currentStep].speaker === 'alien'
                      ? require('@/assets/images/aliens/alien_example_smile.png')
                      : require('@/assets/images/avatar.png')
                  }
                  style={styles.avatar}
                  resizeMode="contain"
                />
                
                {/* Dialog text */}
                <Text style={styles.dialogText}>
                  {dialogSteps[currentStep].text}
                </Text>
              </View>
              
              {/* Next button */}
              <Pressable
                style={styles.nextButton}
                onPress={advanceDialog}
              >
                <Text style={styles.nextButtonText}>{t('next')}</Text>
              </Pressable>
            </>
          )}
        </Animated.View>

        {/* Spaceship */}
        <View style={styles.spaceshipWrapper}>
          <Animated.View
            style={[
              styles.spaceshipContainer,
              {
                transform: [
                  { scale: spaceshipScale }
                ]
              }
            ]}
          >
            <Animated.Image
              source={require('@/assets/images/alien_planet1_spaceship.png')}
              style={[
                styles.spaceship,
                {
                  transform: [
                    { translateX: spaceshipPosition.x },
                    { translateY: spaceshipPosition.y }
                  ]
                }
              ]}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceshipWrapper: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    overflow: 'hidden', // Обрезаем всё, что выходит за границы контейнера
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceshipContainer: {
    width: 160, // Уменьшаем базовый размер контейнера
    height: 160, // Уменьшаем базовый размер контейнера
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceship: {
    width: '100%',
    height: '100%',
  },
  dialogContainer: {
    position: 'absolute',
    top: windowHeight * 0.25, // Moved dialog higher on screen
    width: windowWidth - 40,
    height: 150, // Reduced height from 200 to 150
    alignSelf: 'center',
    zIndex: 10, // Ensure dialog is above other elements
  },
  dialogBubble: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dialogContent: {
    padding: 10, // Reduced padding from 20 to 10
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  avatar: {
    width: 70,
    height: 70,
    marginRight: 15,
    // Removed borderRadius property to show full avatar
    backgroundColor: 'transparent', // Changed from semi-transparent white to transparent
  },
  dialogText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  nextButton: {
    position: 'absolute',
    bottom: 10, // Adjusted from 20 to 10
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});