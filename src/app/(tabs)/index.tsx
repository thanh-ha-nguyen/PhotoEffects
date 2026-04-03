import { Button, HStack, ZStack } from "@/components/ui";
import withPerformanceModeSettings from "@/components/withPerformanceModeSettings";
import { OpenCVImage } from "@/modules/expo-opencv";
import { PhotoEntity } from "@/persistence/schema";
import styled from "@/utils/styled";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  deletePhotoById,
  getAllPhotos,
  insertPhotos,
} from "../../persistence/photos";

const ImagesListScreen: React.FC = () => {
  const [images, setImages] = useState<PhotoEntity[]>([]);
  const insets = useSafeAreaInsets();

  // Safely load images from DB on focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadPhotosFromDb() {
        const photos = await getAllPhotos();
        if (isActive) {
          setImages(photos || []);
        }
      }

      loadPhotosFromDb();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 10,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedPhotos = result.assets.map((asset) => ({
        uri: asset.uri,
        mimeType: asset.mimeType || null,
        width: asset.width,
        height: asset.height,
      }));

      const savedPhotos = await insertPhotos(...selectedPhotos);
      setImages((current) => [...current, ...savedPhotos]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to take photos!");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const newPhoto = {
          uri: asset.uri,
          mimeType: asset.mimeType || null,
          width: asset.width,
          height: asset.height,
        };

        const savedPhotos = await insertPhotos(newPhoto);
        setImages((current) => [...current, ...savedPhotos]);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert(
        "Camera Unavailable",
        "The camera is not available on this device. Please use a physical device to take photos.",
      );
    }
  };

  const handleLongPress = (photo: PhotoEntity) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Share Photo", "Delete Photo"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          if (await Sharing.isAvailableAsync()) {
            try {
              const safeUri =
                FileSystem.cacheDirectory + "share_" + photo.id + ".jpg";
              await FileSystem.copyAsync({
                from: photo.uri,
                to: safeUri,
              });
              await Sharing.shareAsync(safeUri);
            } catch (err) {
              console.error("Error sharing photo", err);
              Alert.alert("Error", "Could not prepare photo for sharing.");
            }
          }
        } else if (buttonIndex === 2) {
          Alert.alert(
            "Delete Photo",
            "Are you sure you want to delete this photo?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                  await deletePhotoById(photo.id);
                  setImages((current) =>
                    current.filter((p) => p.id !== photo.id),
                  );
                },
              },
            ],
          );
        }
      },
    );
  };

  return (
    <StyledSafeAreaView>
      <ImageList
        data={images}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link href={`/photos/${encodeURIComponent(item.id)}`} asChild>
            <StyledTouchableOpacity onLongPress={() => handleLongPress(item)}>
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
      <FloatingButtonContainer style={{ bottom: (insets.bottom || 0) + 20 }}>
        <HStack style={{ gap: 24 }}>
          <Button onPress={takePhoto} style={styles.fab}>
            <Ionicons name="camera" size={24} color="#007AFF" />
          </Button>
          <Button onPress={pickImages} style={styles.fab}>
            <Ionicons name="images" size={24} color="#007AFF" />
          </Button>
        </HStack>
      </FloatingButtonContainer>
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

const StyledSafeAreaView = styled(SafeAreaView)({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7", // Default iOS light gray background
  },
});

const Container = styled(View)({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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

const FloatingButtonContainer = styled(ZStack)({
  root: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: "-50%" }],
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Stronger glassmorphism
    borderRadius: 40,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
});

const styles = StyleSheet.create({
  fab: {
    borderWidth: 1,
    borderColor: "red",
    width: 48,
    height: 48,
    borderRadius: 24, // Perfect circle
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
