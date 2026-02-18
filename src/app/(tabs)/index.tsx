import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function ProjectsStack() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/1">
        <Text style={{ fontSize: 18, color: "blue" }}>Go to 1</Text>
      </Link>
      <Link href="/2">
        <Text style={{ fontSize: 18, color: "blue" }}>Go to 2</Text>
      </Link>
      <Link href="/3">
        <Text style={{ fontSize: 18, color: "blue" }}>Go to 3</Text>
      </Link>
    </View>
  );
}
