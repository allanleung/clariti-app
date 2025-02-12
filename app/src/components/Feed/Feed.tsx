import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import FeedCard from "../FeedCard/FeedCard";
import { FeedItem } from "@/app/src/types/types";
import { useGetDogImagesQuery, useLazyGetDogImagesQuery } from "@/services/api";

const INITIAL_LOAD = 10;
const LOAD_MORE_COUNT = 5;

const Feed: React.FC = () => {
  // Local state to accumulate feed items and track the next index.
  const [items, setItems] = useState<FeedItem[]>([]);
  const [nextIndex, setNextIndex] = useState<number>(1);

  // Initial fetch with RTK Query
  const { data, error, isLoading, isFetching, refetch } = useGetDogImagesQuery({
    count: INITIAL_LOAD,
    startIndex: 1,
  });

  // Lazy query for infinite scroll (load more)
  const [triggerLoadMore, { data: moreData, isFetching: isLoadingMore }] =
    useLazyGetDogImagesQuery();

  // When the initial data is loaded, update the local state.
  useEffect(() => {
    if (data) {
      setItems(data);
      setNextIndex(data.length + 1);
    }
  }, [data]);

  // When more data is fetched (infinite scroll), append it.
  useEffect(() => {
    if (moreData && moreData.length > 0) {
      setItems((prev) => [...prev, ...moreData]);
      setNextIndex((prev) => prev + moreData.length);
    }
  }, [moreData]);

  // Trigger loading more items when the list is scrolled to the bottom.
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && !isLoading) {
      triggerLoadMore({ count: LOAD_MORE_COUNT, startIndex: nextIndex });
    }
  }, [isLoadingMore, isLoading, triggerLoadMore, nextIndex]);

  // Pull-to-refresh handler that refetches the initial data.
  const handleRefresh = useCallback(async () => {
    const refreshed = await refetch();
    if (refreshed?.data) {
      setItems(refreshed.data);
      setNextIndex(refreshed.data.length + 1);
    }
  }, [refetch]);

  // Memoized render function for list items
  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => <FeedCard item={item} />,
    []
  );

  // Display a simple loading/error state if needed
  if (isLoading && items.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error && items.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Error loading dog feed. This could be API issue.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />
        }
        initialNumToRender={10}
        windowSize={5} // Adjust this value based on your use-case
        maxToRenderPerBatch={10} // Adjust based on your card complexity.
        removeClippedSubviews
        ListFooterComponent={
          isLoadingMore ? (
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
