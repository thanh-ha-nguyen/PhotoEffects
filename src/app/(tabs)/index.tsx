import withPerformanceModeSettings from "@/components/withPerformanceModeSettings";
import { OpenCVImage } from "@/modules/expo-opencv";
import { PhotoEntity } from "@/persistence/schema";
import styled from "@/utils/styled";
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
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPhotos, insertPhotos } from "../../persistence/photos";

const ImagesListScreen: React.FC = () => {
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
    <StyledSafeAreaView>
      <ImageList
        data={images}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link href={`/photos/${encodeURIComponent(item.id)}`} asChild>
            <StyledTouchableOpacity>
              <Image source={{ uri: item.uri }} />
            </StyledTouchableOpacity>
          </Link>
        )}
        horizontal={false}
        numColumns={3}
      />
      {images.length === 0 && (
        <Container style={StyleSheet.absoluteFill}>
          <EmptyText>No photos selected.</EmptyText>
        </Container>
      )}
      <Button title="Pick Photos from Gallery" onPress={pickImages} />
    </StyledSafeAreaView>
  );
};

export default withPerformanceModeSettings(ImagesListScreen);

const ImageList = styled(FlatList<PhotoEntity>)({
  root: {
    flex: 1,
    width: "100%",
    padding: 8,
  },
});

const Image = styled(OpenCVImage)({
  root: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 8,
  },
});

const containerStyle: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const StyledSafeAreaView = styled(SafeAreaView)({
  root: containerStyle,
});

const Container = styled(View)({
  root: containerStyle,
});

const StyledTouchableOpacity = styled(TouchableOpacity)({
  root: {
    margin: 8,
  },
});

const EmptyText = styled(Text)({
  root: {
    fontSize: 16,
    color: "#888",
  },
});
