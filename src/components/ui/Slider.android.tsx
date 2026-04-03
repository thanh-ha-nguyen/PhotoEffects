import { Host, Slider as AndroidSlider } from "@expo/ui/jetpack-compose";
import React from "react";

/**
 * Slider component for Android (using Jetpack Compose).
 * Note: Must be wrapped in <Host> to provide Compose environment and layout support.
 */
export const Slider: React.FC<{
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: any;
}> = ({ value, onValueChange, min, max, step, style }) => (
  <Host style={style} matchContents={true}>
    <AndroidSlider
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      steps={step && min && max ? Math.floor((max - min) / step) : 0}
    />
  </Host>
);
