import type { ModifierConfig } from "@expo/ui/swift-ui/modifiers";
import React from "react";
import { ViewStyle } from "react-native";
import mapStyleToModifiers from "./mapStyleToModifiers";

export default function withMapStyleToModifiers<P extends object>(
  Component: React.ComponentType<P>,
) {
  const AutoMapStyleToMdifiers: React.FC<
    P & { modifiers?: ModifierConfig[]; style?: ViewStyle }
  > = ({ modifiers = [], style, ...props }) => {
    return (
      <Component
        modifiers={[mapStyleToModifiers(style), ...modifiers]}
        {...(props as P)}
      />
    );
  };

  return AutoMapStyleToMdifiers;
}
