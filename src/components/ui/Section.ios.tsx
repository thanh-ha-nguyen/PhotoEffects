import { Section as NativeSection } from "@expo/ui/swift-ui";
import React from "react";
import { AutoHost } from "./utils.ios";

export const Section: React.FC<any> = ({ children, ...props }) => (
  <AutoHost style={props.style} matchContents={true}>
    <NativeSection {...props}>{children}</NativeSection>
  </AutoHost>
);
