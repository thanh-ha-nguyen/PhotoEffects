import { Slider as NativeSlider } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost } from "./utils.ios";

export const Slider: React.FC<{
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: any;
}> = ({ value, onValueChange, min, max, step, style }) => (
  <AutoHost matchContents={true} style={style}>
    <NativeSlider
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
    />
  </AutoHost>
);
