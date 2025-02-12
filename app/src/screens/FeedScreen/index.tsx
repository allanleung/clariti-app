import Feed from "@/app/src/components/Feed/Feed";
import React from "react";
import { View, StyleSheet } from "react-native";
import AppBar from "../../components/AppBar/AppBar";
import { useTheme } from "react-native-paper";

const FeedScreen = () => {
  const theme = useTheme();

  return (
    <>
      <AppBar title={"Dog Feed"} />
      <View style={styles.container}>
        <Feed />
      </View>
    </>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
