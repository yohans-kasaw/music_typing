import { FC } from "react";
import MusicIcon from "../../svgs/MusicIcon";
import { LyricsSelector } from "./LyricsSelector";
import { VolumeControl } from "./VolumeControl";

interface TopBarProps {
  availableLyricsNames: string[] | null;
  onLyricsSelect?: (lyricsName: string) => void;
}

const TopBar: FC<TopBarProps> = ({ availableLyricsNames, onLyricsSelect }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <MusicIcon className="w-6 h-6 mr-2" />
        <LyricsSelector availableLyricsNames={availableLyricsNames} onLyricsSelect={onLyricsSelect} />
      </div>
      <VolumeControl />
    </div>
  );
};

export default TopBar;
