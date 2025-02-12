import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FeedItem } from '@/app/src/types/types';

interface GetDogImagesArgs {
  count?: number;
  startIndex?: number;
}

export const feedApi = createApi({
  reducerPath: 'feedApi', // unique key in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.thedogapi.com/v1/',
  }),
  endpoints: (builder) => ({
    getDogImages: builder.query<FeedItem[], GetDogImagesArgs>({
      query: ({ count = 10 }) => `images/search?limit=${count}`,
      transformResponse: (response: any[], meta, arg) => {
        try {
          return response.map((item, index) => ({
            id: `${Date.now()}-${Math.random()}`,
            title: `Cute Dog Picture ${(arg.startIndex || 1) + index}`,
            description: 'A lovely dog!',
            imageUrl: item.url,
          }));
        } catch (error) {
          console.error('Error transforming Dog API response', error);
          throw error;
        }
      },
      // Cache dog images data for 60 seconds
      keepUnusedDataFor: 60,
    }),
  }),
});
export {};
export const { useGetDogImagesQuery, useLazyGetDogImagesQuery } = feedApi;
