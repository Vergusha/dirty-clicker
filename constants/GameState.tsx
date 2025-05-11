import React, { createContext, useContext, useEffect, useState } from 'react';

// Game state interface
interface GameState {
  clicks: number;
  clickPower: number;
  clickPowerLevel: number;
  clickPowerCost: number;
  passiveIncome: number;
  passiveIncomeLevel: number;
  passiveIncomeCost: number;
  
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
  addClicks: (amount: number) => void;
  upgradeClickPower: () => void;
  upgradePassiveIncome: () => void;
  
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
  clicks: 0,
  clickPower: 1,
  clickPowerLevel: 0,
  clickPowerCost: BASE_CLICK_POWER_COST,
  passiveIncome: 0,
  passiveIncomeLevel: 0,
  passiveIncomeCost: BASE_PASSIVE_INCOME_COST,
  
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
  
  addClicks: () => {},
  upgradeClickPower: () => {},
  upgradePassiveIncome: () => {},
  
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
  const [clicks, setClicks] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [clickPowerLevel, setClickPowerLevel] = useState(0);
  const [clickPowerCost, setClickPowerCost] = useState(BASE_CLICK_POWER_COST);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [passiveIncomeLevel, setPassiveIncomeLevel] = useState(0);
  const [passiveIncomeCost, setPassiveIncomeCost] = useState(BASE_PASSIVE_INCOME_COST);
  
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
      setClicks(prev => prev + passiveIncome);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [passiveIncome]);
  
  // Add clicks (from clicking or passive income)
  const addClicks = (amount: number) => {
    setClicks(prev => prev + amount);
  };
  
  // Upgrade click power
  const upgradeClickPower = () => {
    if (clicks >= clickPowerCost) {
      setClicks(prev => prev - clickPowerCost);
      setClickPowerLevel(prev => prev + 1);
      setClickPower(prev => prev + 1);
      setClickPowerCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
    }
  };
  
  // Upgrade passive income
  const upgradePassiveIncome = () => {
    if (clicks >= passiveIncomeCost) {
      setClicks(prev => prev - passiveIncomeCost);
      setPassiveIncomeLevel(prev => prev + 1);
      setPassiveIncome(prev => prev + 1);
      setPassiveIncomeCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
    }
  };
  
  // New upgrade functions
  
  // Upgrade enhanced click (+5 click power)
  const upgradeEnhancedClick = () => {
    if (clicks >= enhancedClickCost) {
      setClicks(prev => prev - enhancedClickCost);
      setEnhancedClickLevel(prev => prev + 1);
      setClickPower(prev => prev + 5);
      setEnhancedClickCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
    }
  };
  
  // Upgrade fast flow (+6 clicks per second)
  const upgradeFastFlow = () => {
    if (clicks >= fastFlowCost) {
      setClicks(prev => prev - fastFlowCost);
      setFastFlowLevel(prev => prev + 1);
      setPassiveIncome(prev => prev + 6);
      setFastFlowCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
    }
  };
  
  // Upgrade powerful hit (+100 click power)
  const upgradePowerfulHit = () => {
    if (clicks >= powerfulHitCost) {
      setClicks(prev => prev - powerfulHitCost);
      setPowerfulHitLevel(prev => prev + 1);
      setClickPower(prev => prev + 100);
      setPowerfulHitCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
    }
  };
  
  // Upgrade golden shower (+200 clicks per second)
  const upgradeGoldenShower = () => {
    if (clicks >= goldenShowerCost) {
      setClicks(prev => prev - goldenShowerCost);
      setGoldenShowerLevel(prev => prev + 1);
      setPassiveIncome(prev => prev + 200);
      setGoldenShowerCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
    }
  };
  
  // Upgrade giant strength (+1000 click power)
  const upgradeGiantStrength = () => {
    if (clicks >= giantStrengthCost) {
      setClicks(prev => prev - giantStrengthCost);
      setGiantStrengthLevel(prev => prev + 1);
      setClickPower(prev => prev + 1000);
      setGiantStrengthCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
    }
  };
  
  // Upgrade click machine (+5000 clicks per second)
  const upgradeClickMachine = () => {
    if (clicks >= clickMachineCost) {
      setClicks(prev => prev - clickMachineCost);
      setClickMachineLevel(prev => prev + 1);
      setPassiveIncome(prev => prev + 5000);
      setClickMachineCost(prev => Math.floor(prev * UPGRADE_COST_MULTIPLIER));
    }
  };
  
  const value = {
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
    
    addClicks,
    upgradeClickPower,
    upgradePassiveIncome,
    
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