import { Text as NativeText } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost } from "./utils.ios";

export const Text: React.FC<any> = ({ children, ...props }) => (
  <AutoHost matchContents={true} style={props.style}>
    <NativeText {...props}>{children}</NativeText>
  </AutoHost>
);
