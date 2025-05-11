import { Audio } from 'expo-av';

// Sound objects
let clickSound: Audio.Sound | null = null;
let upgradeSound: Audio.Sound | null = null;

// Sound states
let soundEffectsEnabled = true;
let soundEffectsVolume = 1.0;

// Ambient music objects
const ambientTracks = [
  require('@/assets/audio/embient_1.mp3'),
  require('@/assets/audio/embient_2.mp3'),
  require('@/assets/audio/embient_3.mp3'),
  require('@/assets/audio/embient_4.mp3'),
];
let ambientSound: Audio.Sound | null = null;
let currentAmbientTrack = 0;
let isAmbientPlaying = false;
let ambientMusicVolume = 0.5;

// Load sound files
export const loadSounds = async () => {
  try {
    console.log('Loading sounds...');
    
    // Load click sound
    const { sound: clickSoundObject } = await Audio.Sound.createAsync(
      require('@/assets/audio/click_sound.mp3'),
      { isMuted: false, volume: soundEffectsVolume }
    );
    clickSound = clickSoundObject;
    
    // Load upgrade sound
    const { sound: upgradeSoundObject } = await Audio.Sound.createAsync(
      require('@/assets/audio/upgrade_sound.mp3'),
      { isMuted: false, volume: soundEffectsVolume }
    );
    upgradeSound = upgradeSoundObject;
    
    // Initial load of first ambient track
    await loadAmbientTrack(0);
    
    console.log('Sounds loaded successfully');
  } catch (error) {
    console.error('Failed to load sounds:', error);
  }
};

// Load a specific ambient track
const loadAmbientTrack = async (trackIndex: number) => {
  try {
    // Unload previous track if exists
    if (ambientSound) {
      await ambientSound.unloadAsync();
    }
    
    // Load new track
    const { sound: ambientSoundObject } = await Audio.Sound.createAsync(
      ambientTracks[trackIndex],
      { 
        isLooping: false, 
        isMuted: false,
        volume: ambientMusicVolume 
      }
    );
    
    // Set up onPlaybackStatusUpdate to detect when the track ends
    ambientSoundObject.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && status.didJustFinish) {
        // When track ends, play the next one
        const nextTrackIndex = (trackIndex + 1) % ambientTracks.length;
        await loadAmbientTrack(nextTrackIndex);
        if (isAmbientPlaying) {
          await playAmbientMusic();
        }
      }
    });
    
    ambientSound = ambientSoundObject;
    currentAmbientTrack = trackIndex;
    console.log(`Ambient track ${trackIndex + 1} loaded`);
  } catch (error) {
    console.error(`Failed to load ambient track ${trackIndex + 1}:`, error);
  }
};

// Play click sound
export const playClickSound = async () => {
  try {
    if (clickSound && soundEffectsEnabled) {
      await clickSound.stopAsync(); // Stop any playing sound first
      await clickSound.setPositionAsync(0); // Rewind to the beginning
      await clickSound.setVolumeAsync(soundEffectsVolume);
      await clickSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play click sound:', error);
  }
};

// Play upgrade sound
export const playUpgradeSound = async () => {
  try {
    if (upgradeSound && soundEffectsEnabled) {
      await upgradeSound.stopAsync(); // Stop any playing sound first
      await upgradeSound.setPositionAsync(0); // Rewind to the beginning
      await upgradeSound.setVolumeAsync(soundEffectsVolume);
      await upgradeSound.playAsync();
    }
  } catch (error) {
    console.error('Failed to play upgrade sound:', error);
  }
};

// Play ambient music
export const playAmbientMusic = async () => {
  try {
    if (ambientSound) {
      await ambientSound.setVolumeAsync(ambientMusicVolume);
      await ambientSound.playAsync();
      isAmbientPlaying = true;
      console.log(`Now playing ambient track ${currentAmbientTrack + 1}`);
    }
  } catch (error) {
    console.error('Failed to play ambient music:', error);
  }
};

// Pause ambient music
export const pauseAmbientMusic = async () => {
  try {
    if (ambientSound) {
      await ambientSound.pauseAsync();
      isAmbientPlaying = false;
    }
  } catch (error) {
    console.error('Failed to pause ambient music:', error);
  }
};

// Toggle ambient music
export const toggleAmbientMusic = async () => {
  try {
    if (!ambientSound) return false;
    
    if (isAmbientPlaying) {
      await pauseAmbientMusic();
    } else {
      await playAmbientMusic();
    }
    
    return isAmbientPlaying;
  } catch (error) {
    console.error('Failed to toggle ambient music:', error);
    return isAmbientPlaying;
  }
};

// Toggle sound effects
export const toggleSoundEffects = async () => {
  soundEffectsEnabled = !soundEffectsEnabled;
  return soundEffectsEnabled;
};

// Set sound effects volume
export const setSoundEffectsVolume = (volume: number) => {
  soundEffectsVolume = volume;
  
  // Update volume for all sound effect objects
  if (clickSound) {
    clickSound.setVolumeAsync(volume).catch(error => {
      console.error('Failed to set click sound volume:', error);
    });
  }
  
  if (upgradeSound) {
    upgradeSound.setVolumeAsync(volume).catch(error => {
      console.error('Failed to set upgrade sound volume:', error);
    });
  }
};

// Set ambient music volume
export const setAmbientMusicVolume = (volume: number) => {
  ambientMusicVolume = volume;
  if (ambientSound) {
    ambientSound.setVolumeAsync(volume).catch(error => {
      console.error('Failed to set ambient music volume:', error);
    });
  }
};

// Get sound effects volume
export const getSoundEffectsVolume = () => {
  return soundEffectsVolume;
};

// Get ambient music volume
export const getAmbientMusicVolume = () => {
  return ambientMusicVolume;
};

// Check if ambient music is playing
export const isAmbientMusicPlaying = () => {
  return isAmbientPlaying;
};

// Check if sound effects are enabled
export const areSoundEffectsEnabled = () => {
  return soundEffectsEnabled;
};

// Get current ambient track number (1-4)
export const getCurrentAmbientTrack = () => {
  return currentAmbientTrack + 1;
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
    if (ambientSound) {
      await ambientSound.unloadAsync();
      ambientSound = null;
    }
    isAmbientPlaying = false;
  } catch (error) {
    console.error('Failed to unload sounds:', error);
  }
};