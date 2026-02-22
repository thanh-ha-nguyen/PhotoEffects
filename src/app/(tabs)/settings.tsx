import db from "@/persistence/db";
import migrations from "@/persistence/drizzle/migrations";
import { photoEffects, photos } from "@/persistence/schema";
import { getTableName } from "drizzle-orm";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { Button, StyleSheet, Text } from "react-native";
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        Edit app/(tabs)/settings.tsx to edit this screen.
      </Text>
      {process.env.EXPO_PUBLIC_ALLOW_DELETE_DB === "yes" && (
        <Button title="Delete database" onPress={handleDeleteDatabase} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginVertical: "auto",
  },
});
