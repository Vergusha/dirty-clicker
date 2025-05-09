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
  
  // Actions
  addClicks: (amount: number) => void;
  upgradeClickPower: () => void;
  upgradePassiveIncome: () => void;
}

// Initial game values
const BASE_CLICK_POWER_COST = 50;
const BASE_PASSIVE_INCOME_COST = 125;
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
  addClicks: () => {},
  upgradeClickPower: () => {},
  upgradePassiveIncome: () => {},
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
  
  const value = {
    clicks,
    clickPower,
    clickPowerLevel,
    clickPowerCost,
    passiveIncome,
    passiveIncomeLevel,
    passiveIncomeCost,
    addClicks,
    upgradeClickPower,
    upgradePassiveIncome,
  };
  
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

// Hook for using the game state
export const useGameState = () => useContext(GameStateContext);