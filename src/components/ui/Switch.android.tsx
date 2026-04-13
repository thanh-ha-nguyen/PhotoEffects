import { Host, Switch as AndroidSwitch } from "@expo/ui/jetpack-compose";
import React from "react";

/**
 * Switch component for Android (using Jetpack Compose).
 * Note: Must be wrapped in <Host> to provide Compose environment and layout support.
 */
export const Switch: React.FC<{
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: any;
}> = ({ value, onValueChange, style }) => (
  <Host style={style} matchContents={true}>
    <AndroidSwitch value={value} onCheckedChange={onValueChange} />
  </Host>
);
