import { createStore } from "redux";
import { SongDetails } from "../domain/lyrics";
import { thunk } from "redux-thunk";
import { applyMiddleware } from "redux";

const initialState = {
  count: 0,
  songData: null as SongDetails | null,
  songFetchError: null as Error | null,
  availableSongNames: null as String[] | null,
  selectedSongName: null as string | null,
};

export const fetchSongDetails = (songName: string) : Function => {
  return (dispatch: any) => {
    const base_url = "/public/lyrics/";
    const url = `${base_url}${songName}.json`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(
            "Network response was not ok + " + response.status,
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("success loading song data");
        dispatch({ type: "FETCH_SONG_DETAILS_SUCCESS", payload: data });
      })
      .catch((error) => {
        console.log("error loading song data");
        dispatch({ type: "FETCH_SONG_DETAILS_ERROR", payload: error });
      });
  };
};

export const fetchAvailableSongNames = () => {
  return (dispatch: any) => {
    const base_url = "/public/lyrics/";
    const url = `${base_url}index.json`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(
            "Network response was not ok + " + response.status,
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("success loading available song names");
        dispatch({ type: "FETCH_AVAILABLE_SONG_NAMES_SUCCESS", payload: data.availableSongNames });
      })
      .catch((error) => {
        console.log("error loading available song names");
        dispatch({ type: "FETCH_AVAILABLE_SONG_NAMES_ERROR", payload: error });
      });
  };
}


function lyricsReducer(
  state = initialState,
  action: any,
) {
  switch (action.type) {
    case "FETCH_SONG_DETAILS":
      return { ...state, songData: null, songFetchError: null };
    case "FETCH_SONG_DETAILS_SUCCESS":
      return { ...state, songData: action.payload, songFetchError: null };
    case "FETCH_SONG_DETAILS_ERROR":
      return { ...state, songData: null, songFetchError: action.payload };
    case "FETCH_AVAILABLE_SONG_NAMES_SUCCESS":
      return { ...state, availableSongNames: action.payload };
    case "FETCH_AVAILABLE_SONG_NAMES_ERROR":
      return { ...state, availableSongNames: null, songFetchError: action.payload};
    case "SELECT_SONG_NAME":
      return { ...state, selectedSongName: action.payload };
    default:
      return state;
  }
}

const store = createStore(lyricsReducer, applyMiddleware(thunk));

export default store;
