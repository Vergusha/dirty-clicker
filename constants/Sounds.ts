import { Audio } from 'expo-av';

// Sound objects
let clickSound: Audio.Sound | null = null;
let upgradeSound: Audio.Sound | null = null;

// Load sound files
export const loadSounds = async () => {
  try {
    console.log('Loading sounds...');
    
    // Load click sound
    const { sound: clickSoundObject } = await Audio.Sound.createAsync(
      require('@/assets/audio/click_sound.mp3'),
      { isMuted: false }
    );
    clickSound = clickSoundObject;
    
    // Load upgrade sound
    const { sound: upgradeSoundObject } = await Audio.Sound.createAsync(
      require('@/assets/audio/upgrade_sound.mp3'),
      { isMuted: false }
    );
    upgradeSound = upgradeSoundObject;
    
    console.log('Sounds loaded successfully');
  } catch (error) {
    console.error('Failed to load sounds:', error);
  }
};

// Play click sound
export const playClickSound = async () => {
  try {
    if (clickSound) {
      await clickSound.stopAsync(); // Stop any playing sound first
      await clickSound.setPositionAsync(0); // Rewind to the beginning
      await clickSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play click sound:', error);
  }
};

// Play upgrade sound
export const playUpgradeSound = async () => {
  try {
    if (upgradeSound) {
      await upgradeSound.stopAsync(); // Stop any playing sound first
      await upgradeSound.setPositionAsync(0); // Rewind to the beginning
      await upgradeSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play upgrade sound:', error);
  }
};

// Clean up sounds
export const unloadSounds = async () => {
  try {
    if (clickSound) {
      await clickSound.unloadAsync();
      clickSound = null;
    }
    if (upgradeSound) {
      await upgradeSound.unloadAsync();
      upgradeSound = null;
    }
  } catch (error) {
    console.error('Failed to unload sounds:', error);
  }
};