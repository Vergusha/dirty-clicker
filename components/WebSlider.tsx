import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

interface WebSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
  thumbTintColor: string;
  disabled: boolean;
  style?: any;
}

export function WebSlider({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor,
  disabled,
  style,
}: WebSliderProps) {
  // Calculate the progress percentage for styling
  const progressPercent = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;
  
  // Create the gradient for the track
  const backgroundStyle = {
    background: `linear-gradient(to right, 
      ${minimumTrackTintColor} 0%, 
      ${minimumTrackTintColor} ${progressPercent}%, 
      ${maximumTrackTintColor} ${progressPercent}%, 
      ${maximumTrackTintColor} 100%)`
  };
  
  // Inject CSS for styling range inputs (only once)
  useEffect(() => {
    // Create a style element if it doesn't exist
    const styleId = 'custom-slider-style';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .custom-range-input {
          width: 100%;
          height: 10px;
          border-radius: 5px;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }
        
        .custom-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .custom-range-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
        
        .custom-range-input::-webkit-slider-runnable-track {
          height: 10px;
          border-radius: 5px;
        }
        
        .custom-range-input::-moz-range-track {
          height: 10px;
          border-radius: 5px;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  return (
    <input
      type="range"
      min={minimumValue}
      max={maximumValue}
      step={(maximumValue - minimumValue) / 100}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      disabled={disabled}
      className="custom-range-input"
      style={{
        ...styles.slider,
        ...backgroundStyle,
        // Apply thumb color
        '--thumb-color': thumbTintColor,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
    />
  );
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    outlineWidth: 0,
    outlineStyle: 'none',
    outlineColor: 'transparent',
  },
});