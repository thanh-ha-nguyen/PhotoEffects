import { ZStack as NativeZStack } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost, mapStyleToModifiers } from "./utils.ios";

export const ZStack: React.FC<any> = ({ children, ...props }) => (
  <AutoHost style={props.style} matchContents={true}>
    <NativeZStack {...props} modifiers={mapStyleToModifiers(props.style)}>
      {children}
    </NativeZStack>
  </AutoHost>
);
