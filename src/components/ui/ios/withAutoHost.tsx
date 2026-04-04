import { HostProps, Host as NativeHost } from "@expo/ui/swift-ui";
import React from "react";
import { UIHostContext } from "./context";

/**
 * Host component: The mandatory root for any SwiftUI view tree.
 */
const Host: React.FC<HostProps> = ({ children, ...props }) => (
  <UIHostContext.Provider value={true}>
    <NativeHost {...props}>{children}</NativeHost>
  </UIHostContext.Provider>
);

/**
 * A higher-order component that wraps the provided component in an AutoHost.
 * This ensures the component is always rendered within a SwiftUI Host environment.
 */
export default function withAutoHost<P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> {
  const AutoHost: React.FC<P> = (props) => {
    const hasHost = React.useContext(UIHostContext);
    if (hasHost) return <Component {...props} />;
    return (
      <Host matchContents>
        <Component {...props} />
      </Host>
    );
  };

  return AutoHost;
}
