import { createContext } from "react";

/**
 * Context to track if we are already inside a SwiftUI Host.
 */
export const UIHostContext = createContext<boolean>(false);
