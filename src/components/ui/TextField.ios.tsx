import { TextField as NativeTextField } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost } from "./utils.ios";

export const TextField: React.FC<any> = (props) => (
  <AutoHost matchContents={true} style={props.style}>
    <NativeTextField {...props} />
  </AutoHost>
);
