import { FC, ChangeEvent } from "react";

interface LyricsSelectorProps {
  availableLyricsNames: string[] | null;
  onLyricsSelect?: (lyricsName: string) => void;
}

export const LyricsSelector: FC<LyricsSelectorProps> = ({
  availableLyricsNames,
  onLyricsSelect,
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLyrics = e.target.value;
    if (onLyricsSelect) {
      onLyricsSelect(selectedLyrics);
    }
  };

  if (!availableLyricsNames) return null;

  return (
    <select
      className="bg-[#2b2b2b] border-none rounded-lg px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
      onChange={handleChange}
    >
      {availableLyricsNames.map((lyricsName) => (
        <option key={lyricsName} value={lyricsName}>
          {lyricsName}
        </option>
      ))}
    </select>
  );
};
