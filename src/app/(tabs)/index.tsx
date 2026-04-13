import withPerformanceModeSettings from "@/components/withPerformanceModeSettings";
import { OpenCVImage } from "@/modules/expo-opencv";
import { PhotoEntity } from "@/persistence/schema";
import styled from "@/utils/styled";
import { Button, Host, HStack, Image, ZStack } from "@expo/ui/swift-ui";
import { buttonStyle, padding } from "@expo/ui/swift-ui/modifiers";
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
  Text as RNText,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  deletePhotoById,
  getAllPhotos,
  insertPhotos,
} from "../../persistence/photos";

const ImagesListScreen: React.FC = () => {
  const [images, setImages] = useState<PhotoEntity[]>([]);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

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

  const takePhoto = async () => {
    // Ask for camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to take photos!");
      return;
    }

    try {
      // Open camera to take a photo
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

        // Save the captured photo to DB
        const savedPhotos = await insertPhotos(newPhoto);
        setImages((current) => [...current, ...savedPhotos]);
      }
    } catch (error) {
      // Camera is not available on simulators
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
          // Share
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
          // Delete
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
    <Host style={{ flex: 1 }}>
      <ZStack alignment="topTrailing">
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: insets.top,
            left: insets.left,
            height: height - insets.bottom,
            width: width - insets.right,
          }}
        >
          <ImageList
            data={images}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Link href={`/photos/${encodeURIComponent(item.id)}`} asChild>
                <StyledTouchableOpacity
                  onLongPress={() => handleLongPress(item)}
                >
                  <StyledImage source={{ uri: item.uri }} />
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
        </View>
        <HStack modifiers={[padding()]}>
          <Button modifiers={[buttonStyle("glass")]} onPress={takePhoto}>
            <Image systemName="camera.fill" size={24} />
          </Button>
          <Button
            modifiers={[buttonStyle("glass"), padding({ leading: 12 })]}
            onPress={pickImages}
          >
            <Image systemName="photo.on.rectangle.angled.fill" size={24} />
          </Button>
        </HStack>
      </ZStack>
    </Host>
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

const StyledImage = styled(OpenCVImage)({
  root: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 8,
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

const EmptyText = styled(RNText)({
  root: {
    fontSize: 16,
    color: "#888",
  },
});
