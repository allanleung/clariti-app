import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Battery from "@/app/batteryModule";

const BatteryInfo: React.FC = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    // Get the initial battery level
    Battery.getBatteryLevel().then(setBatteryLevel).catch(console.error);

    // Subscribe to battery updates
    const subscription = Battery.addListener((level) => {
      setBatteryLevel(level);
    });

    // Clean up the subscription on unmount
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.header}>
      <Text style={styles.text}>
        Battery: {batteryLevel !== null ? `${batteryLevel}%` : "Loading..."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    // backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default BatteryInfo;
