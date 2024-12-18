import parseLRC, { ParsedLRC } from "./lib/lrc_parser";
import Typingverse from "./app/components/Typeverse";
import { useEffect, useState } from "react";

function App() {
  const [lyrics, setLyrics] = useState<ParsedLRC | null>(null);

  useEffect(() => {
    fetch("/lrc/test_lrc1.lrc")
      .then((res) => res.text())
      .then((res) => setLyrics(parseLRC(res)));
  }, []);

  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);

  const handleIndexChange = (newIndex: number) => {
    setCurrentLineIndex(newIndex);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-red-300 bg-gradient-to-b from-[#1a1a1a] to-[#2b2b2b]">
      <div className="max-w-3xl w-full px-6 py-8 bg-[#1a1a1a] rounded-lg shadow-lg">
        {lyrics ? (
          <Typingverse
            parsedLrc={lyrics}
            initialIndex={currentLineIndex}
            onIndexChange={handleIndexChange}
          />
        ) : (
          <div> loading... </div>
        )}
      </div>
    </div>
  );
}

export default App;
