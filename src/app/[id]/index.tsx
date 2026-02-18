import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ProjectStack() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerTitle: `Project ${id}` }} />
      <Text>Edit app/[id]/index.tsx to edit this screen.</Text>
    </View>
  );
}
