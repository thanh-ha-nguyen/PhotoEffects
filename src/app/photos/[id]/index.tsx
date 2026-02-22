import PanZoomView from "@/components/PanZoomView";
import { OpenCVImage } from "@/modules/expo-opencv";
import { getPhotoById } from "@/persistence/photos";
import { PhotoEntity } from "@/persistence/schema";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ProjectStack() {
  const [headerTitle, setHeaderTitle] = useState("Loading...");
  const [photo, setPhoto] = useState<PhotoEntity | undefined>();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    async function loadPhotoFromDb() {
      const photo = await getPhotoById(Number(id));
      setHeaderTitle(photo ? `Photo ${photo.id}` : "Photo not found");
      setPhoto(photo);
    }
    loadPhotoFromDb();
  }, [id]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen options={{ headerTitle }} />
      {photo && (
        <PanZoomView width={photo.width} height={photo.height}>
          <OpenCVImage
            source={{ uri: photo.uri }}
            effects={[]}
            contentFit="contain"
            style={StyleSheet.absoluteFill}
          />
        </PanZoomView>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
