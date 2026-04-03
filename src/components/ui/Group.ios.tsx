import { Group as NativeGroup } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost } from "./utils.ios";

export const Group: React.FC<any> = ({ children, ...props }) => (
  <AutoHost style={props.style} matchContents={true}>
    <NativeGroup {...props}>{children}</NativeGroup>
  </AutoHost>
);
