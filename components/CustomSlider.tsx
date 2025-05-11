import NativeSlider from '@react-native-community/slider';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface CustomSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  disabled?: boolean;
  style?: any;
}

export default function CustomSlider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  minimumTrackTintColor = '#4CAF50',
  maximumTrackTintColor = '#333333',
  thumbTintColor = '#4CAF50',
  disabled = false,
  style,
}: CustomSliderProps) {
  // Use platform-specific implementation
  const SliderComponent = Platform.OS === 'web' ? WebSlider : NativeSlider;
  
  return (
    <View style={[styles.container, style]}>
      <SliderComponent
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
        disabled={disabled}
        style={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  slider: {
    flex: 1,
  },
});