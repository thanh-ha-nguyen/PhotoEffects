import { HStack, Slider, Text, VStack } from "@/components/ui";
import React from "react";
import { ViewStyle } from "react-native";

export interface ListItemSliderInputProps {
  helperText?: string;
  inputProps?: {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
  };
  inputStyle?: ViewStyle;
  label?: string;
  showValueLabel?: boolean;
  valueLabelFormat?: (value: number) => string;
}

const ListItemSliderInput: React.FC<ListItemSliderInputProps> = ({
  helperText,
  inputProps,
  inputStyle,
  label,
  showValueLabel,
  valueLabelFormat = (value: number) => String(value),
}) => (
  <VStack style={{ paddingVertical: 10 }}>
    <HStack style={{ justifyContent: "space-between", marginBottom: 8 }}>
      {label && (
        <Text style={{ fontSize: 17, fontWeight: "500" }}>{label}</Text>
      )}
      {showValueLabel && inputProps && (
        <Text style={{ fontSize: 15, color: "#007AFF" }}>
          {valueLabelFormat(inputProps.value)}
        </Text>
      )}
    </HStack>
    {inputProps && (
      <Slider
        value={inputProps.value}
        onValueChange={inputProps.onValueChange}
        min={inputProps.min}
        max={inputProps.max}
        step={inputProps.step}
        style={[{ height: 40 }, inputStyle]}
      />
    )}
    {helperText && (
      <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
        {helperText}
      </Text>
    )}
  </VStack>
);

export default ListItemSliderInput;
