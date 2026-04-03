import { Host as NativeHost } from "@expo/ui/swift-ui";
import React from "react";
import { UIHostContext } from "./context";

/**
 * Host component: The mandatory root for any SwiftUI view tree.
 */
export const Host: React.FC<any> = ({ children, ...props }) => (
  <UIHostContext.Provider value={true}>
    <NativeHost {...props}>{children}</NativeHost>
  </UIHostContext.Provider>
);
