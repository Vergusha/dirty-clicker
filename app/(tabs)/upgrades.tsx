import React from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGameState } from '@/constants/GameState';
import { useLocalization } from '@/constants/localization/LocalizationContext';

export default function UpgradesScreen() {
  const { t } = useLocalization();
  const {
    dilithium,
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
    titleKey: string,
    descriptionKey: string,
    level: number,
    effectType: 'power' | 'income',
    effectValue: number,
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
        <Text style={styles.upgradeName}>{t(`upgrades_${titleKey}.name`)}</Text>
        <Text style={styles.upgradeDescription}>{t(`upgrades_${titleKey}.description`)}</Text>
        <Text style={styles.upgradeStats}>
          {t('currentLevel')}: {level} | {
            effectType === 'power' 
              ? `${t('currentPower')}: +${effectValue}`
              : `${t('currentIncome')}: +${effectValue}/${t('perSecond')}`
          }
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
            <View style={styles.costContainer}>
              <Text style={styles.upgradeButtonText}>{cost}</Text>
              <Image 
                source={require('@/assets/images/dilithium.png')}
                style={styles.dilithiumIcon}
                resizeMode="contain"
              />
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{t('upgrades')}</Text>
      <View style={styles.resourceContainer}>
        <Image
          source={require('@/assets/images/dilithium.png')}
          style={styles.headerDilithiumIcon}
          resizeMode="contain"
        />
        <Text style={styles.clicksCounter}>{t('available')}: {dilithium}</Text>
      </View>
      
      <ScrollView style={styles.upgradesContainer}>
        {/* Basic Upgrades */}
        <Text style={styles.categoryHeader}>{t('basicUpgrades')}</Text>
        
        {/* Click Power Upgrade */}
        {renderUpgradeCard(
          "dilithiumExtraction",
          "dilithiumExtraction",
          clickPowerLevel,
          'power',
          clickPower,
          clickPowerCost,
          upgradeClickPower,
          dilithium < clickPowerCost
        )}

        {/* Passive Income Upgrade */}
        {renderUpgradeCard(
          "passiveCrystallization",
          "passiveCrystallization",
          passiveIncomeLevel,
          'income',
          passiveIncome,
          passiveIncomeCost,
          upgradePassiveIncome,
          dilithium < passiveIncomeCost
        )}

        {/* Enhanced Upgrades */}
        <Text style={styles.categoryHeader}>{t('advancedUpgrades')}</Text>
        
        {/* Enhanced Click Upgrade */}
        {renderUpgradeCard(
          "phaseResonator",
          "phaseResonator",
          enhancedClickLevel,
          'power',
          enhancedClickLevel * 5,
          enhancedClickCost,
          upgradeEnhancedClick,
          dilithium < enhancedClickCost
        )}
        
        {/* Fast Flow Upgrade */}
        {renderUpgradeCard(
          "dilithiumConduit",
          "dilithiumConduit",
          fastFlowLevel,
          'income',
          fastFlowLevel * 6,
          fastFlowCost,
          upgradeFastFlow,
          dilithium < fastFlowCost
        )}
        
        {/* Advanced Upgrades */}
        <Text style={styles.categoryHeader}>{t('highLevelUpgrades')}</Text>
        
        {/* Powerful Hit Upgrade */}
        {renderUpgradeCard(
          "crystalCompressor",
          "crystalCompressor",
          powerfulHitLevel,
          'power',
          powerfulHitLevel * 100,
          powerfulHitCost,
          upgradePowerfulHit,
          dilithium < powerfulHitCost
        )}
        
        {/* Golden Shower Upgrade */}
        {renderUpgradeCard(
          "dilithiumCascade",
          "dilithiumCascade",
          goldenShowerLevel,
          'income',
          goldenShowerLevel * 200,
          goldenShowerCost,
          upgradeGoldenShower,
          dilithium < goldenShowerCost
        )}
        
        {/* Elite Upgrades */}
        <Text style={styles.categoryHeader}>{t('eliteUpgrades')}</Text>
        
        {/* Giant's Strength Upgrade */}
        {renderUpgradeCard(
          "quantumSplitter",
          "quantumSplitter",
          giantStrengthLevel,
          'power',
          giantStrengthLevel * 1000,
          giantStrengthCost,
          upgradeGiantStrength,
          dilithium < giantStrengthCost
        )}
        
        {/* Click Machine Upgrade */}
        {renderUpgradeCard(
          "dilithiumMatrix",
          "dilithiumMatrix",
          clickMachineLevel,
          'income',
          clickMachineLevel * 5000,
          clickMachineCost,
          upgradeClickMachine,
          dilithium < clickMachineCost
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
  resourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerDilithiumIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  clicksCounter: {
    fontSize: 20,
    color: '#4CAF50',
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
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dilithiumIcon: {
    width: 20,
    height: 20,
    marginLeft: 6,
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