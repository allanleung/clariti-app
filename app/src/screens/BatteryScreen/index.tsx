import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import BatteryHeader from "../../components/BatteryHeader/BatteryHeader";

const BatteryScreen = () => {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <BatteryHeader />
      <Text
        style={[styles.header, { color: theme.colors.onTertiaryContainer }]}
      >
        Battery Screen
      </Text>
    </View>
  );
};

export default BatteryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
  },
});
