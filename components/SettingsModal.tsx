import {
    areSoundEffectsEnabled,
    getAmbientMusicVolume,
    getSoundEffectsVolume,
    isAmbientMusicPlaying,
    setAmbientMusicVolume,
    setSoundEffectsVolume,
    toggleAmbientMusic,
    toggleSoundEffects
} from '@/constants/Sounds';
import { Language, useLocalization } from '@/constants/localization/LocalizationContext';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomSlider from './CustomSlider';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  // Get localization context
  const { t, locale, setLocale, languages } = useLocalization();
  
  // Инициализируем состояния при открытии модального окна
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(false);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  
  const [soundEffectsVolume, setSoundEffectsVolumeState] = useState(1);
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  
  // При каждом открытии модального окна обновляем состояние
  useEffect(() => {
    if (visible) {
      setSoundEffectsEnabled(areSoundEffectsEnabled());
      setAmbientEnabled(isAmbientMusicPlaying());
      
      setSoundEffectsVolumeState(getSoundEffectsVolume());
      setAmbientVolume(getAmbientMusicVolume());
    }
  }, [visible]);
  
  const handleSoundEffectsToggle = async () => {
    const enabled = await toggleSoundEffects();
    setSoundEffectsEnabled(enabled);
  };
  
  const handleAmbientToggle = async () => {
    const enabled = await toggleAmbientMusic();
    setAmbientEnabled(enabled);
  };
  
  const handleSoundEffectsVolumeChange = (value: number) => {
    setSoundEffectsVolumeState(value);
    setSoundEffectsVolume(value);
  };
  
  const handleAmbientVolumeChange = (value: number) => {
    setAmbientVolume(value);
    setAmbientMusicVolume(value);
  };

  const handleLanguageChange = (lang: Language) => {
    setLocale(lang);
  };
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ImageBackground 
          source={require('@/assets/images/settings_panel.png')} 
          style={styles.modalView}
          imageStyle={styles.modalBackground}
          resizeMode="stretch"
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings')}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
                <Image 
                  source={require('@/assets/images/close_button.png')}
                  style={styles.closeButton}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('soundEffects')}</Text>
              <View style={styles.controls}>
                <CustomSlider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={soundEffectsVolume}
                  onValueChange={handleSoundEffectsVolumeChange}
                  minimumTrackTintColor="#4CAF50"
                  maximumTrackTintColor="#333333"
                  thumbTintColor="#4CAF50"
                  disabled={!soundEffectsEnabled}
                />
                <TouchableOpacity onPress={handleSoundEffectsToggle} style={styles.soundButton}>
                  <Image
                    source={soundEffectsEnabled 
                      ? require('@/assets/images/volume_on.png')
                      : require('@/assets/images/volume_off.png')
                    }
                    style={styles.soundIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('music')}</Text>
              <View style={styles.controls}>
                <CustomSlider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={ambientVolume}
                  onValueChange={handleAmbientVolumeChange}
                  minimumTrackTintColor="#4CAF50"
                  maximumTrackTintColor="#333333"
                  thumbTintColor="#4CAF50"
                  disabled={!ambientEnabled}
                />
                <TouchableOpacity onPress={handleAmbientToggle} style={styles.soundButton}>
                  <Image
                    source={ambientEnabled 
                      ? require('@/assets/images/volume_on.png')
                      : require('@/assets/images/volume_off.png')
                    }
                    style={styles.soundIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Language Selection */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('language')}</Text>
              <View style={styles.languageSelector}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageButton,
                      locale === lang.code ? styles.selectedLanguage : null
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text 
                      style={[
                        styles.languageText,
                        locale === lang.code ? styles.selectedLanguageText : null
                      ]}
                    >
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.attribution}>Music by Clavier</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalView: {
    width: isSmallDevice ? '100%' : '100%',
    aspectRatio: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    borderRadius: 12,
  },
  modalContent: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingRow: {
    marginBottom: 25,
    width: '100%',
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: 40,
    marginRight: 15,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 10,
  },
  attribution: {
    color: '#DDDDDD',
    fontSize: 14,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  closeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
  },
  soundButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundIcon: {
    width: 32,
    height: 32,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  selectedLanguage: {
    backgroundColor: '#4CAF50',
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  selectedLanguageText: {
    fontWeight: 'bold',
  },
});