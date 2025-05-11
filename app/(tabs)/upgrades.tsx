import React from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGameState } from '@/constants/GameState';

export default function UpgradesScreen() {
  const {
    clicks,
    clickPower,
    clickPowerLevel,
    clickPowerCost,
    passiveIncome,
    passiveIncomeLevel,
    passiveIncomeCost,
    
    // New upgrade properties
    enhancedClickLevel,
    enhancedClickCost,
    fastFlowLevel,
    fastFlowCost,
    powerfulHitLevel,
    powerfulHitCost,
    goldenShowerLevel,
    goldenShowerCost,
    giantStrengthLevel,
    giantStrengthCost,
    clickMachineLevel,
    clickMachineCost,
    
    upgradeClickPower,
    upgradePassiveIncome,
    
    // New upgrade functions
    upgradeEnhancedClick,
    upgradeFastFlow,
    upgradePowerfulHit,
    upgradeGoldenShower,
    upgradeGiantStrength,
    upgradeClickMachine
  } = useGameState();

  // Helper function to render an upgrade card
  const renderUpgradeCard = (
    title: string,
    description: string,
    level: number,
    effect: string,
    cost: number,
    onUpgrade: () => void,
    disabled: boolean
  ) => (
    <ImageBackground 
      source={require('@/assets/images/upgrade_panel.png')} 
      style={styles.upgradeCard}
      imageStyle={styles.upgradeCardImage}
      resizeMode="stretch"
    >
      <View style={styles.upgradeInfo}>
        <Text style={styles.upgradeName}>{title}</Text>
        <Text style={styles.upgradeDescription}>{description}</Text>
        <Text style={styles.upgradeStats}>
          Текущий уровень: {level} | {effect}
        </Text>
      </View>
      
      <View style={styles.upgradeButtonWrapper}>
        <Pressable
          style={styles.upgradeButtonContainer}
          onPress={onUpgrade}
          disabled={disabled}
        >
          <ImageBackground
            source={require('@/assets/images/upgrade button.png')}
            style={[styles.upgradeButton, disabled && styles.disabledButton]}
            resizeMode="stretch"
          >
            <Text style={styles.upgradeButtonText}>
              {cost} 👆
            </Text>
          </ImageBackground>
        </Pressable>
      </View>
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Улучшения</Text>
      <Text style={styles.clicksCounter}>Доступно кликов: {clicks}</Text>
      
      <ScrollView style={styles.upgradesContainer}>
        {/* Basic Upgrades */}
        <Text style={styles.categoryHeader}>Базовые улучшения</Text>
        
        {/* Click Power Upgrade */}
        {renderUpgradeCard(
          "Сила клика",
          "Увеличивает силу клика на 1",
          clickPowerLevel,
          `Текущая сила: +${clickPower}`,
          clickPowerCost,
          upgradeClickPower,
          clicks < clickPowerCost
        )}

        {/* Passive Income Upgrade */}
        {renderUpgradeCard(
          "Пассивный доход",
          "Добавляет +1 клик в секунду",
          passiveIncomeLevel,
          `Текущий доход: +${passiveIncome}/сек`,
          passiveIncomeCost,
          upgradePassiveIncome,
          clicks < passiveIncomeCost
        )}

        {/* Enhanced Upgrades */}
        <Text style={styles.categoryHeader}>Продвинутые улучшения</Text>
        
        {/* Enhanced Click Upgrade */}
        {renderUpgradeCard(
          "Усиленный клик",
          "Увеличивает силу клика на 5",
          enhancedClickLevel,
          `Бонус к силе: +${enhancedClickLevel * 5}`,
          enhancedClickCost,
          upgradeEnhancedClick,
          clicks < enhancedClickCost
        )}
        
        {/* Fast Flow Upgrade */}
        {renderUpgradeCard(
          "Быстрый поток",
          "Добавляет +6 кликов в секунду",
          fastFlowLevel,
          `Бонус к доходу: +${fastFlowLevel * 6}/сек`,
          fastFlowCost,
          upgradeFastFlow,
          clicks < fastFlowCost
        )}
        
        {/* Advanced Upgrades */}
        <Text style={styles.categoryHeader}>Улучшения высокого уровня</Text>
        
        {/* Powerful Hit Upgrade */}
        {renderUpgradeCard(
          "Мощный удар",
          "Увеличивает силу клика на 100",
          powerfulHitLevel,
          `Бонус к силе: +${powerfulHitLevel * 100}`,
          powerfulHitCost,
          upgradePowerfulHit,
          clicks < powerfulHitCost
        )}
        
        {/* Golden Shower Upgrade */}
        {renderUpgradeCard(
          "Золотой дождь",
          "Добавляет +200 кликов в секунду",
          goldenShowerLevel,
          `Бонус к доходу: +${goldenShowerLevel * 200}/сек`,
          goldenShowerCost,
          upgradeGoldenShower,
          clicks < goldenShowerCost
        )}
        
        {/* Elite Upgrades */}
        <Text style={styles.categoryHeader}>Элитные улучшения</Text>
        
        {/* Giant's Strength Upgrade */}
        {renderUpgradeCard(
          "Сила гиганта",
          "Увеличивает силу клика на 1000",
          giantStrengthLevel,
          `Бонус к силе: +${giantStrengthLevel * 1000}`,
          giantStrengthCost,
          upgradeGiantStrength,
          clicks < giantStrengthCost
        )}
        
        {/* Click Machine Upgrade */}
        {renderUpgradeCard(
          "Клик-машина",
          "Добавляет +5000 кликов в секунду",
          clickMachineLevel,
          `Бонус к доходу: +${clickMachineLevel * 5000}/сек`,
          clickMachineCost,
          upgradeClickMachine,
          clicks < clickMachineCost
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
    marginBottom: 8,
    textAlign: 'center',
  },
  clicksCounter: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  upgradesContainer: {
    flex: 1,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
    marginBottom: 8,
  },
  upgradeCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  upgradeCardImage: {
    borderRadius: 10,
  },
  upgradeInfo: {
    marginBottom: 12,
  },
  upgradeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  upgradeDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  upgradeStats: {
    fontSize: 14,
    color: '#DDDDDD',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  upgradeButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  upgradeButtonContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  upgradeButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});