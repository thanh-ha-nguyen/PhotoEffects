import { Toggle } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost } from "./utils.ios";

export const Switch: React.FC<{
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: any;
}> = ({ value, onValueChange, style }) => (
  <AutoHost matchContents={true} style={style}>
    <Toggle isOn={value} onIsOnChange={onValueChange} />
  </AutoHost>
);
