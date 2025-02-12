import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Battery from "expo-battery";
import { useTheme } from "react-native-paper";

const BatteryHeader = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const theme = useTheme();

  useEffect(() => {
    // Get the initial battery level
    const fetchBatteryLevel = async () => {
      try {
        const level = await Battery.getBatteryLevelAsync();
        setBatteryLevel(level);
      } catch (error) {
        console.error("Failed to get battery level:", error);
      }
    };

    fetchBatteryLevel();
    // Subscribe to battery level updates
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel);
    });
    // Clean up the subscriptio
    return () => {
      subscription?.remove();
    };
  }, []);

  // Convert battery level (a value between 0 and 1) to a percentage
  const batteryPercentage =
    batteryLevel !== null ? Math.round(batteryLevel * 100) : "N/A";

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: theme.colors.primary },
      ]}
    >
      <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
        Battery: {batteryPercentage}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // adds shadow on Android
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BatteryHeader;
