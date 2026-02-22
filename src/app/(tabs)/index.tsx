import { OpenCVImage } from "@/modules/expo-opencv";
import { PhotoEntity } from "@/persistence/schema";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPhotos, insertPhotos } from "../../persistence/photos";

export default function ProjectsStack() {
  const [images, setImages] = useState<PhotoEntity[]>([]);

  // Load images from DB on mount
  useEffect(() => {
    async function loadPhotosFromDb() {
      const photos = await getAllPhotos();
      if (photos && photos.length > 0) {
        setImages(photos);
      }
    }

    loadPhotosFromDb();
  }, []);

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

    if (!result.canceled && result.assets.length > 0) {
      // Update state with new images
      const selectedPhotos = result.assets.map((asset) => ({
        uri: asset.uri,
        mimeType: asset.mimeType || null,
        width: asset.width,
        height: asset.height,
      }));

      // Save each image to DB
      const savedPhotos = await insertPhotos(...selectedPhotos);
      setImages((current) => [...current, ...savedPhotos]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link href={`/photos/${encodeURIComponent(item.id)}`} asChild>
            <TouchableOpacity style={{ margin: 8 }}>
              <OpenCVImage source={{ uri: item.uri }} style={styles.image} />
            </TouchableOpacity>
          </Link>
        )}
        horizontal={false}
        numColumns={3}
        style={styles.imageList}
      />
      {images.length === 0 && (
        <View style={[styles.container, StyleSheet.absoluteFill]}>
          <Text style={styles.emptyText}>No photos selected.</Text>
        </View>
      )}
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
  },
});
