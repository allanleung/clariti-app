import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useThemeToggle } from "@/app/src/theme/ThemeProvider";

const SettingScreen = () => {
  const theme = useTheme();
  const { toggleTheme, isDarkTheme } = useThemeToggle();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text
        style={[styles.header, { color: theme.colors.onTertiaryContainer }]}
      >
        Setting Screen
      </Text>
      <Text
        style={[styles.status, { color: theme.colors.onTertiaryContainer }]}
      >
        {isDarkTheme ? "Dark Theme Active" : "Light Theme Active"}
      </Text>
      <Text
        onPress={toggleTheme}
        style={[styles.button, { color: theme.colors.onTertiaryContainer }]}
      >
        Toggle Theme
      </Text>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  status: {
    fontSize: 24,
  },
  button: {
    fontSize: 24,
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
