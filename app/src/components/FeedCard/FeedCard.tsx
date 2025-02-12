import { FeedItem } from "@/app/src/types/types";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Title, Paragraph, ActivityIndicator } from "react-native-paper";
import Icon from "@/app/src/components/CustomIcon/CustomIcon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.8; // Size of image relative to width
const COLLAPSED_HEIGHT = 100; // Height when collapsed
const GAP_BETWEEN_IMAGE = 80; // Don't Change This

const FeedCardComponent: React.FC<{ item: FeedItem }> = ({ item }) => {
  // Default card is expand
  const [expanded, setExpanded] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  // Default heart is set to unlike
  const [liked, setLiked] = useState<boolean>(false);

  // Animated value for smooth card height expansion/collapse
  // const animatedHeight = useRef(new Animated.Value(IMAGE_HEIGHT + GAP_BETWEEN_IMAGE)).current;
  const animatedHeight = useRef(
    new Animated.Value(IMAGE_HEIGHT + GAP_BETWEEN_IMAGE)
  ).current;

  // Animated value for heart rotation
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Toggle card expansion
  const toggleExpand = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? COLLAPSED_HEIGHT : IMAGE_HEIGHT + GAP_BETWEEN_IMAGE,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setExpanded((prev) => !prev);
  };

  // Handle heart press with a little rotation animation
  const onHeartPress = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 25, // Rotate to 25 degrees
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0, // Return to 0 degrees
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setLiked((prev) => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={toggleExpand}>
      <Animated.View style={[styles.card, { height: animatedHeight }]}>
        <Card>
          {/* Image with Loading Indicator */}
          <View style={styles.imageContainer}>
            <Card.Cover
              source={{ uri: item.imageUrl }}
              style={[
                styles.image,
                { width: SCREEN_WIDTH, height: IMAGE_HEIGHT },
              ]}
              onLoadEnd={() => setLoading(false)}
            />
            {loading && (
              <ActivityIndicator
                animating={true}
                size={40}
                style={styles.loader}
                color="red"
              />
            )}
          </View>

          {/* Card Content with Text on the Left and Heart Icon on the Right */}
          <Card.Content style={styles.content}>
            <View style={styles.row}>
              <View style={styles.textContainer}>
                <Title>{item.title}</Title>
                {expanded && <Paragraph>{item.description}</Paragraph>}
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onHeartPress();
                }}
              >
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: rotateAnim.interpolate({
                          inputRange: [0, 20],
                          outputRange: ["0deg", "20deg"],
                        }),
                      },
                    ],
                  }}
                >
                  <Icon
                    name={liked ? "favorite" : "favorite-border"}
                    size={30}
                    color={liked ? "red" : "grey"}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 8,
    // backgroundColor: "#fff",
    overflow: "hidden", // Ensures a clean layout
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6, // Android shadow
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    resizeMode: "cover",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  content: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
});

// Performance optimization so we make sure FeedCard prevent unnecessary re-renders when props do not change.
const FeedCard = React.memo(FeedCardComponent);
export default FeedCard;
