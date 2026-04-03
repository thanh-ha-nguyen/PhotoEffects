import { Button as NativeButton, ZStack as NativeZStack } from "@expo/ui/swift-ui";
import React from "react";
import { StyleSheet } from "react-native";
import { AutoHost, mapStyleToModifiers } from "./utils.ios";

export const Button: React.FC<any> = ({ children, style, ...props }) => {
  const finalStyle = StyleSheet.flatten([styles.button, style]);
  const modifiers = mapStyleToModifiers(finalStyle);

  return (
    <AutoHost matchContents={true} style={finalStyle}>
      <NativeButton {...props}>
        <NativeZStack
          alignment="center"
          modifiers={modifiers}
        >
          {children}
        </NativeZStack>
      </NativeButton>
    </AutoHost>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
