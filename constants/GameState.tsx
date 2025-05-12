import React, { createContext, useContext, useEffect, useState } from 'react';
import { playUpgradeSound } from './Sounds';

// Game state interface
interface GameState {
  dilithium: number; // Переименовано с clicks на dilithium
  clickPower: number;
  clickPowerLevel: number;
  clickPowerCost: number;
  passiveIncome: number;
  passiveIncomeLevel: number;
  passiveIncomeCost: number;
  firstPassiveUpgradeShown: boolean; // Flag for showing first passive upgrade tutorial
  
  // New upgrade types
  enhancedClickLevel: number;
  enhancedClickCost: number;
  fastFlowLevel: number;
  fastFlowCost: number;
  powerfulHitLevel: number;
  powerfulHitCost: number;
  goldenShowerLevel: number;
  goldenShowerCost: number;
  giantStrengthLevel: number;
  giantStrengthCost: number;
  clickMachineLevel: number;
  clickMachineCost: number;
  
  // Actions
  addDilithium: (amount: number) => void; // Переименовано с addClicks на addDilithium
  upgradeClickPower: () => void;
  upgradePassiveIncome: () => void;
  setFirstPassiveUpgradeShown: (shown: boolean) => void; // New function to set tutorial flag
  
  // New upgrade actions
  upgradeEnhancedClick: () => void;
  upgradeFastFlow: () => void;
  upgradePowerfulHit: () => void;
  upgradeGoldenShower: () => void;
  upgradeGiantStrength: () => void;
  upgradeClickMachine: () => void;
}

// Initial game values
const BASE_CLICK_POWER_COST = 50;
const BASE_PASSIVE_INCOME_COST = 125;
const BASE_ENHANCED_CLICK_COST = 500;
const BASE_FAST_FLOW_COST = 1100;
const BASE_POWERFUL_HIT_COST = 12000;
const BASE_GOLDEN_SHOWER_COST = 100000;
const BASE_GIANT_STRENGTH_COST = 90000;
const BASE_CLICK_MACHINE_COST = 315000;
const UPGRADE_COST_MULTIPLIER = 1.15;

// Create context with default values
const GameStateContext = createContext<GameState>({
  dilithium: 0, // Переименовано с clicks на dilithium
  clickPower: 1,
  clickPowerLevel: 0,
  clickPowerCost: BASE_CLICK_POWER_COST,
  passiveIncome: 0,
  passiveIncomeLevel: 0,
  passiveIncomeCost: BASE_PASSIVE_INCOME_COST,
  firstPassiveUpgradeShown: false, // Default value for tutorial flag
  
  // New upgrade defaults
  enhancedClickLevel: 0,
  enhancedClickCost: BASE_ENHANCED_CLICK_COST,
  fastFlowLevel: 0,
  fastFlowCost: BASE_FAST_FLOW_COST,
  powerfulHitLevel: 0,
  powerfulHitCost: BASE_POWERFUL_HIT_COST,
  goldenShowerLevel: 0,
  goldenShowerCost: BASE_GOLDEN_SHOWER_COST,
  giantStrengthLevel: 0,
  giantStrengthCost: BASE_GIANT_STRENGTH_COST,
  clickMachineLevel: 0,
  clickMachineCost: BASE_CLICK_MACHINE_COST,
  
  addDilithium: () => {}, // Переименовано с addClicks на addDilithium
  upgradeClickPower: () => {},
  upgradePassiveIncome: () => {},
  setFirstPassiveUpgradeShown: () => {}, // Default implementation
  
  // New upgrade actions
  upgradeEnhancedClick: () => {},
  upgradeFastFlow: () => {},
  upgradePowerfulHit: () => {},
  upgradeGoldenShower: () => {},
  upgradeGiantStrength: () => {},
  upgradeClickMachine: () => {},
});

// Provider component
export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [dilithium, setDilithium] = useState(0); // Переименовано с clicks на dilithium
  const [clickPower, setClickPower] = useState(1);
  const [clickPowerLevel, setClickPowerLevel] = useState(0);
  const [clickPowerCost, setClickPowerCost] = useState(BASE_CLICK_POWER_COST);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [passiveIncomeLevel, setPassiveIncomeLevel] = useState(0);
  const [passiveIncomeCost, setPassiveIncomeCost] = useState(BASE_PASSIVE_INCOME_COST);
  const [firstPassiveUpgradeShown, setFirstPassiveUpgradeShown] = useState(false);
  
  // New upgrade states
  const [enhancedClickLevel, setEnhancedClickLevel] = useState(0);
  const [enhancedClickCost, setEnhancedClickCost] = useState(BASE_ENHANCED_CLICK_COST);
  const [fastFlowLevel, setFastFlowLevel] = useState(0);
  const [fastFlowCost, setFastFlowCost] = useState(BASE_FAST_FLOW_COST);
  const [powerfulHitLevel, setPowerfulHitLevel] = useState(0);
  const [powerfulHitCost, setPowerfulHitCost] = useState(BASE_POWERFUL_HIT_COST);
  const [goldenShowerLevel, setGoldenShowerLevel] = useState(0);
  const [goldenShowerCost, setGoldenShowerCost] = useState(BASE_GOLDEN_SHOWER_COST);
  const [giantStrengthLevel, setGiantStrengthLevel] = useState(0);
  const [giantStrengthCost, setGiantStrengthCost] = useState(BASE_GIANT_STRENGTH_COST);
  const [clickMachineLevel, setClickMachineLevel] = useState(0);
  const [clickMachineCost, setClickMachineCost] = useState(BASE_CLICK_MACHINE_COST);
  
  // Add passive income effect
  useEffect(() => {
    if (passiveIncome === 0) return;
    
    const interval = setInterval(() => {
      setDilithium(prev => prev + passiveIncome); // Переименовано с setClicks на setDilithium
    }, 1000);
    
    return () => clearInterval(interval);
  }, [passiveIncome]);
  
  // Add dilithium (from clicking or passive income)
  const addDilithium = (amount: number) => { // Переименовано с addClicks на addDilithium
    setDilithium(prev => prev + amount); // Переименовано с setClicks на setDilithium
  };
  
  // Upgrade click power
  const upgradeClickPower = () => {
    if (dilithium >= clickPowerCost) { // Переименовано с clicks на dilithium
      setDilithium(prev => prev - clickPowerCost); // Переименовано с setClicks на setDilithium
      setClickPowerLevel(prev => prev + 1);
      setClickPower(prev => prev + 1);
      setClickPowerCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
      playUpgradeSound(); // Play upgrade sound
    }
  };
  
  // Upgrade passive income
  const upgradePassiveIncome = () => {
    if (dilithium >= passiveIncomeCost) { // Переименовано с clicks на dilithium
      setDilithium(prev => prev - passiveIncomeCost); // Переименовано с setClicks на setDilithium
      setPassiveIncomeLevel(prev => prev + 1);
      setPassiveIncome(prev => prev + 1);
      setPassiveIncomeCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
      playUpgradeSound(); // Play upgrade sound
    }
  };
  
  // New upgrade functions
  
  // Upgrade enhanced click (+5 click power)
  const upgradeEnhancedClick = () => {
    if (dilithium >= enhancedClickCost) { // Переименовано с clicks на dilithium
      setDilithium(prev => prev - enhancedClickCost); // Переименовано с setClicks на setDilithium
      setEnhancedClickLevel(prev => prev + 1);
      setClickPower(prev => prev + 5);
      setEnhancedClickCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
      playUpgradeSound(); // Play upgrade sound
    }
  };
  
  // Upgrade fast flow (+6 dilithium per second)
  const upgradeFastFlow = () => {
    if (dilithium >= fastFlowCost) { // Переименовано с clicks на dilithium
      setDilithium(prev => prev - fastFlowCost); // Переименовано с setClicks на setDilithium
      setFastFlowLevel(prev => prev + 1);
      setPassiveIncome(prev => prev + 6);
      setFastFlowCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
      playUpgradeSound(); // Play upgrade sound
    }
  };
  
  // Upgrade powerful hit (+100 click power)
  const upgradePowerfulHit = () => {
    if (dilithium >= powerfulHitCost) { // Переименовано с clicks на dilithium
      setDilithium(prev => prev - powerfulHitCost); // Переименовано с setClicks на setDilithium
      setPowerfulHitLevel(prev => prev + 1);
      setClickPower(prev => prev + 100);
      setPowerfulHitCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
      playUpgradeSound(); // Play upgrade sound
    }
  };
  
  // Upgrade golden shower (+200 dilithium per second)
  const upgradeGoldenShower = () => {
    if (dilithium >= goldenShowerCost) { // Переименовано с clicks на dilithium
      setDilithium(prev => prev - goldenShowerCost); // Переименовано с setClicks на setDilithium
      setGoldenShowerLevel(prev => prev + 1);
      setPassiveIncome(prev => prev + 200);
      setGoldenShowerCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
      playUpgradeSound(); // Play upgrade sound
    }
  };
  
  // Upgrade giant strength (+1000 click power)
  const upgradeGiantStrength = () => {
    if (dilithium >= giantStrengthCost) { // Переименовано с clicks на dilithium
      setDilithium(prev => prev - giantStrengthCost); // Переименовано с setClicks на setDilithium
      setGiantStrengthLevel(prev => prev + 1);
      setClickPower(prev => prev + 1000);
      setGiantStrengthCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
      playUpgradeSound(); // Play upgrade sound
    }
  };
  
  // Upgrade click machine (+5000 dilithium per second)
  const upgradeClickMachine = () => {
    if (dilithium >= clickMachineCost) { // Переименовано с clicks на dilithium
      setDilithium(prev => prev - clickMachineCost); // Переименовано с setClicks на setDilithium
      setClickMachineLevel(prev => prev + 1);
      setPassiveIncome(prev => prev + 5000);
      setClickMachineCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
      playUpgradeSound(); // Play upgrade sound
    }
  };
  
  const value = {
    dilithium, // Переименовано с clicks на dilithium
    clickPower,
    clickPowerLevel,
    clickPowerCost,
    passiveIncome,
    passiveIncomeLevel,
    passiveIncomeCost,
    firstPassiveUpgradeShown,
    
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
    
    addDilithium, // Переименовано с addClicks на addDilithium
    upgradeClickPower,
    upgradePassiveIncome,
    setFirstPassiveUpgradeShown,
    
    // New upgrade functions
    upgradeEnhancedClick,
    upgradeFastFlow,
    upgradePowerfulHit,
    upgradeGoldenShower,
    upgradeGiantStrength,
    upgradeClickMachine,
  };
  
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

// Hook for using the game state
export const useGameState = () => useContext(GameStateContext);