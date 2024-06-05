// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import LyricesReducer from './lyrics_slice.ts';
import lyricsApi from './lyrics_api.ts';

const store = configureStore({
  reducer: {
    lyrics: LyricesReducer,
    [lyricsApi.reducerPath]: lyricsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(lyricsApi.middleware),

});

export default store;
