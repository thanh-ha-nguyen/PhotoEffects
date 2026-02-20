import db from "@/persistence/db";
import migrations from "@/persistence/drizzle/migrations";
import * as schema from "@/persistence/schema";
import { getTableName } from "drizzle-orm";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { Link } from "expo-router";
import { Button, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsTab() {
  const handleDeleteDatabase = async () => {
    db.run(`DROP TABLE IF EXISTS "__drizzle_migrations"`);
    for (const table of Object.values(schema)) {
      db.run(`DROP TABLE IF EXISTS "${getTableName(table)}"`);
    }
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
      {process.env.EXPO_PUBLIC_ALLOW_MODULE_TEST === "yes" && (
        <Link href="/module-test" asChild>
          <Button title="Open Module Test" />
        </Link>
      )}
      {process.env.EXPO_PUBLIC_ALLOW_MODULE_TEST === "yes" && (
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
