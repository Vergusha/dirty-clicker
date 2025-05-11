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
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomSlider from './CustomSlider';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
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
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Настройки</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Звуковые эффекты</Text>
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
              <TouchableOpacity onPress={handleSoundEffectsToggle}>
                <MaterialIcons 
                  name={soundEffectsEnabled ? "volume-up" : "volume-off"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Фоновая музыка</Text>
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
              <TouchableOpacity onPress={handleAmbientToggle}>
                <MaterialIcons 
                  name={ambientEnabled ? "volume-up" : "volume-off"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.attribution}>Music by Clavier</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalView: {
    width: '90%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  settingRow: {
    marginBottom: 20
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  slider: {
    flex: 1,
    height: 40,
    marginRight: 10
  },
  footer: {
    marginTop: 20,
    alignItems: 'center'
  },
  attribution: {
    color: '#888888',
    fontSize: 14,
    fontStyle: 'italic'
  }
});