import React from "react";
import { render } from "@testing-library/react-native";
import Feed from "../app/src/components/Feed/Feed";
jest.mock("@/services/api", () => ({
  useGetDogImagesQuery: jest.fn(),
  useLazyGetDogImagesQuery: jest.fn(),
}));

import { useGetDogImagesQuery, useLazyGetDogImagesQuery } from "@/services/api";

describe("Feed Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ======================= TEST START: "Loading State" =======================
  it("should display loading state initially", () => {
    // Set up the mock to simulate a loading state (no data yet)
    (useGetDogImagesQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      isFetching: true,
      refetch: jest.fn(),
    });
    (useLazyGetDogImagesQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      { data: undefined, isFetching: false },
    ]);

    const { getByText } = render(<Feed />);
    expect(getByText("Loading...")).toBeTruthy();
  });
  // ======================= TEST END: "Loading State" =======================

  // ======================= TEST START: "API Not Working" =======================
  it("should display error state if there is an error and no data", () => {
    (useGetDogImagesQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error("Network error"),
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
    });
    (useLazyGetDogImagesQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      { data: undefined, isFetching: false },
    ]);

    const { getByText } = render(<Feed />);
    expect(
      getByText("Error loading dog feed. This could be API issue.")
    ).toBeTruthy();
  });
  // ======================= TEST END: "API Not Working" =======================
});
