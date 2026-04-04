import React from "react";
import {
  Switch as NativeSwitch,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

/**
 * Switch: A unified toggle component.
 * Fallback uses React Native's NativeSwitch.
 */
const Switch: React.FC<{
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
}> = ({ value, onValueChange, style }) => (
  <View style={style}>
    <NativeSwitch value={value} onValueChange={onValueChange} />
  </View>
);

export default Switch;
