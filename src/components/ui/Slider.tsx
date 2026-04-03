import NativeSlider from "@react-native-community/slider";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

/**
 * Slider: A unified value slider component.
 * Fallback uses @react-native-community/slider.
 */
export const Slider: React.FC<{
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ value, onValueChange, min, max, step, style }) => (
  <NativeSlider
    value={value}
    onValueChange={onValueChange}
    minimumValue={min}
    maximumValue={max}
    step={step}
    style={style}
  />
);
