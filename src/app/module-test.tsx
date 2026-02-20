import { OpenCVImage } from "@/modules/expo-opencv";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModuleTest() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Module Test" }} />
      <OpenCVImage
        source={require("@/resources/AppStoreIcon.svg")}
        style={styles.image}
        effects={[
          "grayscale",
          { name: "blur", options: { ksizeWidth: 15, ksizeHeight: 15 } },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderWidth: 1,
    width: 256,
    height: 256,
  },
});
