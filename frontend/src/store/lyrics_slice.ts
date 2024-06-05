import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// create a thunk to fetch all ids
export const fetchAllIds = createAsyncThunk(
  'data/fetchAllIds', 
  async () => {
    console.log('fetching all ids');
    const response = await fetch('/public/lyrics/allIdes.json');
    const data = await response.json();
    return data.Id;
});

const lyricsSlice = createSlice({
  name: 'lyrics',
  initialState: {
    byId: {},
    allIds: ['fake id'],
    status: 'idle',
  },
  reducers: {
    addObject: (state, action) => {
      const object = action.payload;
      state.byId[object.id] = object;
      state.allIds.push(object.id);
    },
    updateObject: (state, action) => {
      const object = action.payload;
      if (state.byId[object.id]) {
        state.byId[object.id] = object;
      }
    },
    deleteObject: (state, action) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter(existingId => existingId !== id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllIds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allIds = action.payload;
      })
      .addCase(fetchAllIds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addObject, updateObject, deleteObject } = lyricsSlice.actions;
export default lyricsSlice.reducer;
