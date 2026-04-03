import { HStack as NativeHStack } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost, extractSpacing, mapStyleToModifiers } from "./utils.ios";

export const HStack: React.FC<any> = ({ children, style, ...props }) => (
  <AutoHost style={style} matchContents={true}>
    <NativeHStack
      spacing={extractSpacing(style, "horizontal")}
      {...props}
      modifiers={mapStyleToModifiers(style)}
    >
      {children}
    </NativeHStack>
  </AutoHost>
);
