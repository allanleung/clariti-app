import React, { useState, useCallback, useEffect } from "react";
import { View, FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import FeedCard from "@/app/src/components/FeedCard/FeedCard";
import { FeedItem } from "@/app/src/types/types";
import { useGetDogImagesQuery, usePrefetch } from "@/services/api";
import { useTheme } from "react-native-paper";

const PAGE_SIZE = 10;
const CARD_MARGIN = 16; // (8 top + 8 bottom)
const DEFAULT_CARD_HEIGHT = 400; // Approximate height when in default state
const getItemHeight = DEFAULT_CARD_HEIGHT + CARD_MARGIN;

const Feed: React.FC = () => {
  const [page, setPage] = useState(1);
  const [accumulatedItems, setAccumulatedItems] = useState<FeedItem[]>([]);

  const { data, error, isLoading, isFetching, refetch } = useGetDogImagesQuery({
    count: PAGE_SIZE,
    page,
  });

  // Prefetch the next page to reduce waiting times.
  const prefetchDogImages = usePrefetch("getDogImages");

  const theme = useTheme();

  useEffect(() => {
    if (data && data.length > 0) {
      if (page === 1) {
        setAccumulatedItems(data);
      } else {
        setAccumulatedItems((prev) => [...prev, ...data]);
      }
      prefetchDogImages({ count: PAGE_SIZE, page: page + 1 });
    }
  }, [data, page, prefetchDogImages]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isFetching && data && data.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, isFetching, data]);

  const handleRefresh = useCallback(async () => {
    setPage(1);
    const refreshed = await refetch();
    if (refreshed?.data) {
      setAccumulatedItems(refreshed.data);
    }
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => <FeedCard item={item} />,
    []
  );

  if (isLoading && accumulatedItems.length === 0) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error && accumulatedItems.length === 0) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <Text>Error loading dog feed. This could be an API issue.</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={accumulatedItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />
        }
        initialNumToRender={PAGE_SIZE}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        getItemLayout={(data, index) => ({
          length: getItemHeight,
          offset: getItemHeight * index,
          index,
        })}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <Text style={styles.loadingMore}>Loading more...</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMore: {
    textAlign: "center",
    padding: 10,
  },
});

export default Feed;
