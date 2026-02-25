import db from "@/persistence/db";
import migrations from "@/persistence/drizzle/migrations";
import {
  Inter_100Thin,
  Inter_100Thin_Italic,
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_700Bold,
  Inter_700Bold_Italic,
} from "@expo-google-fonts/inter";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import { ThemeProvider } from "@rneui/themed";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "expo-sqlite/localStorage/install";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useDrizzleStudio(db.$client);

  const { success: migrationsSuccess, error: migrationError } = useMigrations(
    db,
    migrations,
  );

  const [fontsLoaded] = useFonts({
    "Inter Thin": Inter_100Thin,
    "Inter Regular": Inter_400Regular,
    "Inter Bold": Inter_700Bold,
    "Inter Thin Italic": Inter_100Thin_Italic,
    "Inter Regular Italic": Inter_400Regular_Italic,
    "Inter Bold Italic": Inter_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (migrationError) {
    return (
      <SafeAreaView>
        <Text>Migration error: {migrationError.message}</Text>
      </SafeAreaView>
    );
  }

  if (!migrationsSuccess) {
    return (
      <SafeAreaView>
        <Text>Migration is in progress...</Text>
      </SafeAreaView>
    );
  }

  if (!fontsLoaded) {
    return (
      <SafeAreaView>
        <Text>Fonts are loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerTitle: "Back",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
