import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { UIHostContext } from "./context";
import { Host } from "./Host.ios";
import * as Modifiers from "@expo/ui/swift-ui/modifiers";

/**
 * Utility to extract spacing from React Native styles for SwiftUI components.
 */
export const extractSpacing = (style: any, type: "horizontal" | "vertical") => {
  if (!style) return undefined;
  const flattened = StyleSheet.flatten(style);
  if (type === "horizontal") {
    return flattened.columnGap ?? flattened.gap;
  }
  return flattened.rowGap ?? flattened.gap;
};

/**
 * AutoHost is a helper component that wraps its children in a Host 
 * only if they are not already within one.
 */
export const AutoHost: React.FC<any> = ({ children, style, matchContents }) => {
  const hasHost = useContext(UIHostContext);
  if (hasHost) {
    return <>{children}</>;
  }
  return (
    <Host style={style} matchContents={matchContents}>
      {children}
    </Host>
  );
};

/**
 * Maps React Native styles to @expo/ui/swift-ui modifiers.
 */
export const mapStyleToModifiers = (style: any) => {
  if (!style) return [];
  const flattened = StyleSheet.flatten(style);
  const modifiers: any[] = [];

  // 1. Frame / Sizing (Applied first to stabilize the container)
  if (flattened.width !== undefined || flattened.height !== undefined) {
    modifiers.push(
      Modifiers.frame({
        width: typeof flattened.width === "number" ? flattened.width : undefined,
        height:
          typeof flattened.height === "number" ? flattened.height : undefined,
      }),
    );
  }

  // 2. Padding (Inner spacing if needed)
  if (flattened.padding !== undefined) {
    modifiers.push(Modifiers.padding({ all: flattened.padding }));
  }
  if (flattened.paddingHorizontal !== undefined) {
    modifiers.push(
      Modifiers.padding({ horizontal: flattened.paddingHorizontal }),
    );
  }
  if (flattened.paddingVertical !== undefined) {
    modifiers.push(Modifiers.padding({ vertical: flattened.paddingVertical }));
  }

  // 3. Decoration (Background and Shape)
  // Background must be applied AFTER the frame/padding to fill the intended area correctly
  if (flattened.backgroundColor) {
    modifiers.push(Modifiers.background(flattened.backgroundColor));
  }

  if (flattened.borderRadius) {
    // Corner radius applies to the background area
    modifiers.push((Modifiers as any).cornerRadius?.(flattened.borderRadius));
  }

  // 4. Effects
  if (flattened.opacity !== undefined) {
    modifiers.push(Modifiers.opacity(flattened.opacity));
  }

  if (flattened.shadowColor) {
    modifiers.push(
      Modifiers.shadow({
        color: flattened.shadowColor,
        radius: flattened.shadowRadius || 5,
        x: flattened.shadowOffset?.width || 0,
        y: flattened.shadowOffset?.height || 0,
      }),
    );
  }

  return modifiers;
};
