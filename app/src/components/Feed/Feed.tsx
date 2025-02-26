import React, { useState, useCallback, useEffect } from "react";
import { View, FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import FeedCard from "@/app/src/components/FeedCard/FeedCard";
import { FeedItem } from "@/app/src/types/types";
import { useGetDogImagesQuery } from "@/services/api";

const PAGE_SIZE = 10;

const Feed: React.FC = () => {
  // Track the current page for pagination.
  const [page, setPage] = useState(1);
  // Accumulate items as pages are loaded.
  const [accumulatedItems, setAccumulatedItems] = useState<FeedItem[]>([]);

  // Fetch data based on the current page.
  const { data, error, isLoading, isFetching, refetch } = useGetDogImagesQuery({
    count: PAGE_SIZE,
    page,
  });

  // When data arrives, either reset or append to the accumulated list.
  useEffect(() => {
    if (data && data.length > 0) {
      if (page === 1) {
        setAccumulatedItems(data);
      } else {
        setAccumulatedItems((prev) => [...prev, ...data]);
      }
    }
  }, [data, page]);

  // Load next page when end of list is reached.
  const handleLoadMore = useCallback(() => {
    // Only load more if we're not already fetching data.
    if (!isLoading && !isFetching && data && data.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, isFetching, data]);

  // Pull-to-refresh: reset to first page and refresh data.
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
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error && accumulatedItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Error loading dog feed. This could be an API issue.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        windowSize={5} // Adjust based on your use-case.
        maxToRenderPerBatch={10} // Adjust based on your card complexity.
        removeClippedSubviews
        ListFooterComponent={
          // Show footer only when loading more (after the first page).
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
