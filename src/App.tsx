import { useEffect, useState, useMemo, useCallback } from "react";
import parseLRC, { ParsedLRC } from "./lib/lrc_parser";
import Typingverse from "./app/components/Typeverse";
import TopBar from "./app/components/TopBar/TopBar";
import { typing_track_data } from "./lib/types";
import AudioSync from "./app/components/AudioSync";

function App() {
  const [lyrics, setLyrics] = useState<ParsedLRC | null>(null);
  const [typingTrackData, setTypingTrackData] = useState<typing_track_data[]>(
    [],
  );
  const [selectedLyricsName, setSelectedLyricsName] = useState<string>("");
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch typing track data on mount
  useEffect(() => {
    const fetchTypingTrackData = async () => {
      try {
        const response = await fetch("/data/typing_track_data.json");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch typing track data: ${response.statusText}`,
          );
        }
        const data: typing_track_data[] = await response.json();
        setTypingTrackData(data);
        setSelectedLyricsName(data[0].name);
      } catch (err) {
        console.error(err);
        setError("Unable to load typing track data.");
      }
    };

    fetchTypingTrackData();
  }, []);

  // Fetch lyrics when selectedLyricsName changes
  useEffect(() => {
    if (!selectedLyricsName) {
      setLyrics(null);
      return;
    }

    const fetchLyrics = async () => {
      try {
        const selectedTrack = typingTrackData.find(
          (item) => item.name === selectedLyricsName,
        );
        if (!selectedTrack) {
          throw new Error(`Lyrics path not found for: ${selectedLyricsName}`);
        }

        const response = await fetch(selectedTrack.lrcPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch lyrics: ${response.statusText}`);
        }

        const lrcText = await response.text();
        const parsedLyrics = parseLRC(lrcText);
        setLyrics(parsedLyrics);
      } catch (err) {
        console.error(err);
        setError("Unable to load lyrics.");
        setLyrics(null);
      }
    };

    fetchLyrics();
  }, [selectedLyricsName, typingTrackData]);

  const handleIndexChange = useCallback((newIndex: number) => {
    setCurrentLineIndex(newIndex);
  }, []);

  const handleSeekBackward = useCallback((newIndex: number) => {
    setCurrentLineIndex(newIndex);
  }, []);

  const handleMarkLineUntyped = useCallback((lineIndex: number) => {
    // Example: If you store typed states in Typingverse,
    // you might want to re-initialize that line.
    // You could store typed states in parent or child—design preference.
    // This is just a placeholder to show how you could handle it.
    console.log("Marking line as untyped: ", lineIndex);
  }, []);

  const audioPath = useMemo(() => {
    const track = typingTrackData.find(
      (item) => item.name === selectedLyricsName,
    );
    return track?.audioPath ?? "";
  }, [typingTrackData, selectedLyricsName]);

  const onLyricsSelect = useCallback((selectedName: string) => {
    setSelectedLyricsName(selectedName);
    setCurrentLineIndex(0); // Reset index when a new lyrics is selected
    console.log("Selected lyrics:", selectedName);
    console.log("current inedex:", currentLineIndex);
  }, []);

  const availableLyricsNames = useMemo(
    () => typingTrackData.map((val) => val.name),
    [typingTrackData],
  );

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-b from-[#1a1a1a] to-[#2b2b2b]">
      <div className="max-w-3xl w-full px-6 py-8 bg-[#1a1a1a] rounded-lg shadow-lg">
        <TopBar
          availableLyricsNames={availableLyricsNames}
          onLyricsSelect={onLyricsSelect}
        />
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        {lyrics && (
          <AudioSync
            parsedLrc={lyrics}
            currentLineIndex={currentLineIndex}
            onSeekBackward={handleSeekBackward}
            onMarkLineUntyped={handleMarkLineUntyped}
            audioSrc={audioPath}
          />
        )}

        {lyrics ? (
          <Typingverse
            parsedLrc={lyrics}
            initialIndex={currentLineIndex}
            onIndexChange={handleIndexChange}
          />
        ) : !error ? (
          <div className="text-center">Loading...</div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
