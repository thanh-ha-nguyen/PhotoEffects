import { Toggle } from "@expo/ui/swift-ui";
import withAutoHost from "./ios/withAutoHost";
import withMapStyleToModifiers from "./ios/withMapStyleToModifiers";

export default withAutoHost(withMapStyleToModifiers(Toggle));
