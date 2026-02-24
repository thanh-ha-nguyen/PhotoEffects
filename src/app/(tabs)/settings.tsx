import db from "@/persistence/db";
import migrations from "@/persistence/drizzle/migrations";
import { photoEffects, photos } from "@/persistence/schema";
import styled from "@/utils/styled";
import { getTableName } from "drizzle-orm";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsTab() {
  const handleDeleteDatabase = async () => {
    db.run(`DROP TABLE IF EXISTS "__drizzle_migrations"`);
    db.run(`DROP TABLE IF EXISTS "${getTableName(photoEffects)}"`);
    db.run(`DROP TABLE IF EXISTS "${getTableName(photos)}"`);

    try {
      await db.transaction(async (tx) => {
        await migrate(tx, migrations);
      });
      console.log("Migrations ran successfully after deleting database.");
    } catch (error) {
      console.error("Failed to run migrations after deleting database:", error);
    }
  };

  return (
    <StyledSafeAreaView>
      <StyledText>Edit app/(tabs)/settings.tsx to edit this screen.</StyledText>
      {process.env.EXPO_PUBLIC_ALLOW_DELETE_DB === "yes" && (
        <Button title="Delete database" onPress={handleDeleteDatabase} />
      )}
    </StyledSafeAreaView>
  );
}

const StyledSafeAreaView = styled(SafeAreaView)({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const StyledText = styled(Text)({
  root: {
    marginVertical: "auto",
  },
});
