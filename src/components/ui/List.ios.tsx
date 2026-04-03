import { List as NativeList } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost } from "./utils.ios";

export const List: React.FC<any> = ({ children, ...props }) => (
  <AutoHost style={props.style} matchContents={true}>
    <NativeList {...props}>{children}</NativeList>
  </AutoHost>
);
