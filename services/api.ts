import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FeedItem } from '@/app/src/types/types';

interface GetDogImagesArgs {
  count?: number;
  page?: number;
}

export const feedApi = createApi({
  reducerPath: 'feedApi', // unique key in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.thedogapi.com/v1/',
  }),
  endpoints: (builder) => ({
    getDogImages: builder.query<FeedItem[], GetDogImagesArgs>({
      // Use both count and page for pagination.
      query: ({ count = 10, page = 1 }) => `images/search?limit=${count}&page=${page}`,
      transformResponse: (response: any[], _meta, arg) => {
        // If the API returns an id, use it. Otherwise, build a deterministic one using page and index.
        return response.map((item, index) => ({
          id: item.id || `page-${arg.page}-index-${index}`,
          title: 'Cute Dog Picture',
          description: 'A lovely dog!',
          imageUrl: item.url,
        }));
      },
      // Cache the data for 60 seconds.
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetDogImagesQuery } = feedApi;
