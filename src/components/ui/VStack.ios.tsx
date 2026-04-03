import { VStack as NativeVStack } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost, extractSpacing } from "./utils.ios";

export const VStack: React.FC<any> = ({ children, style, ...props }) => (
  <AutoHost style={style} matchContents={true}>
    <NativeVStack spacing={extractSpacing(style, "vertical")} {...props}>
      {children}
    </NativeVStack>
  </AutoHost>
);
