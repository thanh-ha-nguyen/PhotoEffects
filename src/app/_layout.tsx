import {
  Inter_100Thin,
  Inter_100Thin_Italic,
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_700Bold,
  Inter_700Bold_Italic,
} from "@expo-google-fonts/inter";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady] = useFonts({
    "Inter Thin": Inter_100Thin,
    "Inter Regular": Inter_400Regular,
    "Inter Bold": Inter_700Bold,
    "Inter Thin Italic": Inter_100Thin_Italic,
    "Inter Regular Italic": Inter_400Regular_Italic,
    "Inter Bold Italic": Inter_700Bold_Italic,
  });

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: "Home",
        }}
      />
    </Stack>
  );
}
