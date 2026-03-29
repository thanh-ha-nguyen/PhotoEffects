import withPerformanceModeSettings from "@/components/withPerformanceModeSettings";
import { OpenCVImage } from "@/modules/expo-opencv";
import { PhotoEntity } from "@/persistence/schema";
import styled from "@/utils/styled";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { deletePhotoById, getAllPhotos, insertPhotos } from "../../persistence/photos";

const ImagesListScreen: React.FC = () => {
  const [images, setImages] = useState<PhotoEntity[]>([]);
  const { theme } = useTheme();
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
    }, [])
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

  const handleLongPress = (id: number) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deletePhotoById(id);
            setImages((current) => current.filter((p) => p.id !== id));
          },
        },
      ]
    );
  };

  return (
    <StyledSafeAreaView>
      <ImageList
        data={images}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link href={`/photos/${encodeURIComponent(item.id)}`} asChild>
            <StyledTouchableOpacity onLongPress={() => handleLongPress(item.id)}>
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
        <TouchableOpacity activeOpacity={0.8} onPress={pickImages}>
          <FloatingButton>
            <Ionicons name="images" size={30} color={theme.colors.primary} />
          </FloatingButton>
        </TouchableOpacity>
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

const FloatingButtonContainer = styled(View)({
  root: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    flexDirection: "row",
    gap: 20,
  },
});

const FloatingButton = styled(View)({
  root: {
    backgroundColor: "white",
    borderRadius: 9999,
    opacity: 0.8,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
