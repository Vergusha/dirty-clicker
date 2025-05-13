import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useGameState } from '@/constants/GameState';
import { useLocalization } from '@/constants/localization/LocalizationContext';
import { playUpgradeSound } from '@/constants/Sounds';

interface TradingStationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TradingStationModal({ visible, onClose }: TradingStationModalProps) {
  const { t } = useLocalization();
  const { dilithium, coins, tradeDilithiumForCoins } = useGameState();

  const [tradeAmount, setTradeAmount] = useState('100');
  const [tradeStatus, setTradeStatus] = useState('');

  // Reset trade status when modal is opened or closed
  useEffect(() => {
    if (visible) {
      setTradeStatus('');
      setTradeAmount('100');
    }
  }, [visible]);

  const handleTrade = () => {
    const dilithiumAmount = parseInt(tradeAmount, 10);
    if (isNaN(dilithiumAmount) || dilithiumAmount <= 0) {
      setTradeStatus(t('tradingStation.notEnough'));
      return;
    }

    const success = tradeDilithiumForCoins(dilithiumAmount);
    if (success) {
      setTradeStatus(t('tradingStation.success'));
      playUpgradeSound();
      // Reset trade amount after successful trade
      setTradeAmount('100');
    } else {
      setTradeStatus(t('tradingStation.notEnough'));
    }
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
          <Image 
            source={require('@/assets/images/settings_panel.png')} 
            style={styles.backgroundImage} 
            resizeMode="stretch"
          />
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{t('tradingStation.title')}</Text>
            <Text style={styles.description}>{t('tradingStation.description')}</Text>
            
            <Image 
              source={require('@/assets/images/trading_station.png')} 
              style={styles.tradingStationImage} 
              resizeMode="contain"
            />
            
            <Text style={styles.rateText}>{t('tradingStation.rate')}</Text>
            
            <View style={styles.currencyInfoContainer}>
              <View style={styles.currencyRow}>
                <Image 
                  source={require('@/assets/images/dilithium.png')} 
                  style={styles.resourceIcon} 
                  resizeMode="contain" 
                />
                <Text style={styles.currencyText}>{t('tradingStation.yourDilithium')}: {dilithium}</Text>
              </View>
              
              <View style={styles.currencyRow}>
                <Image 
                  source={require('@/assets/images/coin.png')} 
                  style={styles.resourceIcon} 
                  resizeMode="contain" 
                />
                <Text style={styles.currencyText}>{t('tradingStation.yourCoins')}: {coins}</Text>
              </View>
            </View>
            
            <View style={styles.tradeContainer}>
              <Text style={styles.tradeLabel}>{t('tradingStation.amountToTrade')}:</Text>
              <TextInput
                style={styles.tradeInput}
                value={tradeAmount}
                onChangeText={setTradeAmount}
                keyboardType="number-pad"
                placeholder="100"
                placeholderTextColor="#999"
              />
              
              {tradeStatus ? (
                <Text style={[
                  styles.tradeStatus, 
                  tradeStatus === t('tradingStation.success') ? styles.successText : styles.errorText
                ]}>
                  {tradeStatus}
                </Text>
              ) : null}
            </View>
            
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.tradeButton}
                onPress={handleTrade}
              >
                <Text style={styles.buttonText}>{t('tradingStation.trade')}</Text>
              </Pressable>
              
              <Pressable
                style={styles.closeButton}
                onPress={onClose}
              >
                <Image 
                  source={require('@/assets/images/close_button.png')} 
                  style={styles.closeButtonIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'transparent',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: 500,
    position: 'absolute',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tradingStationImage: {
    width: '70%',
    height: 150,
    marginBottom: 20,
  },
  rateText: {
    fontSize: 18,
    color: '#4CAF50',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  currencyInfoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  currencyText: {
    fontSize: 16,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tradeContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  tradeLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tradeInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    width: '70%',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  tradeStatus: {
    fontSize: 16,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  successText: {
    color: '#4CAF50',
  },
  errorText: {
    color: '#FF6347',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tradeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 12,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonIcon: {
    width: 30,
    height: 30,
  },
});
