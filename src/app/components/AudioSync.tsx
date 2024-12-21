"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ParsedLRC } from "../../lib/lrc_parser"; // adjust import based on your project

interface AudioSyncProps {
  parsedLrc: ParsedLRC;
  audioSrc: string;
  currentLineIndex: number;
  onSeekBackward: (newLineIndex: number) => void;
  onMarkLineUntyped: (lineIndex: number) => void;
}

const AudioSync: React.FC<AudioSyncProps> = ({
  parsedLrc,
  audioSrc,
  currentLineIndex,
  onSeekBackward,
  onMarkLineUntyped,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [internalLineIndex, setInternalLineIndex] = useState<number>(currentLineIndex);

  const lineTimes = parsedLrc.lyrics.map((lyric) => lyric.time);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      const currentTime = audioElement.currentTime;
      const nextLineTime = lineTimes[internalLineIndex + 1];
      
      if (nextLineTime !== undefined) {
        if (currentTime >= nextLineTime && internalLineIndex + 1 > currentLineIndex) {
          audioElement.pause();
        }
      }
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [internalLineIndex, currentLineIndex, lineTimes]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (lineTimes[currentLineIndex] === undefined) return;

    const newTime = lineTimes[currentLineIndex];
    audioRef.current.currentTime = newTime;
    setInternalLineIndex(currentLineIndex);

    audioRef.current.play().catch(() => {
    });
  }, [currentLineIndex, lineTimes]);

  const handleSeekBackward = useCallback(() => {
    if (currentLineIndex <= 0) return;

    onMarkLineUntyped(currentLineIndex);

    onSeekBackward(currentLineIndex - 1);
  }, [currentLineIndex, onSeekBackward, onMarkLineUntyped]);

  return (
    <div style={{ margin: "1rem 0", textAlign: "center" }}>
      <audio ref={audioRef} src={audioSrc} controls />

      <div style={{ marginTop: "0.5rem" }}>
        <button
          onClick={handleSeekBackward}
          disabled={currentLineIndex <= 0}
          style={{ padding: "0.25rem 0.5rem" }}
        >
          Seek Backward One Line
        </button>
      </div>
    </div>
  );
};

export default AudioSync;
