import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectsStack() {
  const [images, setImages] = useState<string[]>([]);

  const pickImages = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    // Pick multiple images
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 10,
    });
    if (!result.canceled && result.assets) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, idx) => item + idx}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ margin: 8 }}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
        horizontal={false}
        numColumns={3}
        style={styles.imageList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No photos selected.</Text>
        }
      />
      <Button title="Pick Photos from Gallery" onPress={pickImages} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 8,
  },
  imageList: {
    flex: 1,
    width: "100%",
    padding: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    margin: "auto",
  },
});
