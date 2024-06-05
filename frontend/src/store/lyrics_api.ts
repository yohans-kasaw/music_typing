import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const lyricsApi = createApi({
  reducerPath: 'lyricsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/public/lyrics/allIdes.json' }),
  endpoints: (builder) => ({
    getAllIds: builder.query({
      query: () => '',
    })
  }),
});

export const { useGetAllIdsQuery } = lyricsApi;
export default lyricsApi;
