import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from "react";
import { ParsedLRC } from "../../lib/lrc_parser";

// Define the props for Typingverse
interface TypingverseProps {
  parsedLrc: ParsedLRC;
  initialIndex?: number;
  onIndexChange?: (currentIndex: number) => void;
}

const Typingverse: React.FC<TypingverseProps> = ({
  parsedLrc,
  initialIndex = 0,
  onIndexChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // State management
  const [currentText, setCurrentText] = useState<string>("");
  const [lineIndex, setLineIndex] = useState<number>(initialIndex);
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [currentWordError, setCurrentWordError] = useState<boolean>(false);

  console.log("current index and line inedx", initialIndex, lineIndex )
  // Extract lyrics from parsedLrc
  const { lyrics } = parsedLrc;

  // Split lyrics into lines and words
  const lines = lyrics.map((lyric) => lyric.text.trim().split(" "));

  // Focus the input when component mounts or lineIndex changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [lineIndex]);

  useEffect(() => {
    setLineIndex(initialIndex)
  }, [initialIndex]);

  // Notify parent component about index changes
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(lineIndex);
    }
  }, [lineIndex, onIndexChange]);

  /**
   * Handler for space key press.
   * Validates the current word and updates indices accordingly.
   */
  const handleSpaceKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      const currentWord = lines[lineIndex]?.[wordIndex];

      if (!currentWord) {
        // No more words to process
        return;
      }

      if (currentText === currentWord) {
        setCurrentWordError(false);
        setCurrentText("");

        // Move to the next word or line
        if (wordIndex + 1 === lines[lineIndex].length) {
          setWordIndex(0);
          setLineIndex((prev) => prev + 1);
        } else {
          setWordIndex((prev) => prev + 1);
        }
      } else {
        setCurrentWordError(true);
      }
    }
  };

  /**
   * Handler for input changes.
   * Updates the current text and validates it against the target word.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setCurrentText(inputText);

    const currentWord = lines[lineIndex]?.[wordIndex];

    if (currentWord) {
      if (
        inputText.length <= currentWord.length &&
        currentWord.startsWith(inputText)
      ) {
        setCurrentWordError(false);
      } else {
        setCurrentWordError(true);
      }
    }
  };

  /**
   * Determines if a line should be visible based on the current lineIndex.
   * @param index - The index of the line.
   * @param numberOfLines - Number of lines to display around the current line.
   * @returns Boolean indicating visibility.
   */
  const isLineVisible = (index: number, numberOfLines: number = 5): boolean => {
    const start = Math.max(
      0,
      Math.min(lineIndex - Math.floor(numberOfLines / 2), lines.length - numberOfLines)
    );
    const end = Math.min(lines.length - 1, start + numberOfLines - 1);
    return index >= start && index <= end;
  };

  /**
   * Checks if the word is the current word to be typed.
   */
  const isCurrentWord = (i: number, j: number): boolean => i === lineIndex && j === wordIndex;

  /**
   * Checks if the word has already been typed correctly.
   */
  const wordIsTyped = (i: number, j: number): boolean =>
    i < lineIndex || (i === lineIndex && j < wordIndex);

  /**
   * Determines the CSS class for a word based on its state.
   */
  const getClass = (i: number, j: number): string => {
    if (wordIsTyped(i, j)) {
      return "text-green-400";
    }

    if (isCurrentWord(i, j)) {
      return currentWordError
        ? "bg-red-800 font-bold text-white-900"
        : "font-bold text-[#ff6b6b]";
    }

    return "";
  };

  /**
   * Renders the lyrics with appropriate styling.
   */
  const renderLyrics = () => {
    return lines.map((line, i) => {
      if (!isLineVisible(i)) {
        return null;
      }

      return (
        <p key={`line-${i}`}>
          {line.map((word, j) => (
            <span key={`word-${i}-${j}`}>
              <span className={getClass(i, j)}>
                {word.split("").map((char, k) => (
                  <span key={`char-${i}-${j}-${k}`}>{char}</span>
                ))}
              </span>{" "}
            </span>
          ))}
        </p>
      );
    });
  };

  return (
    <div>
      <div className="bg-[#2b2b2b] rounded-lg p-6 mb-6 flex flex-col items-center">
        {renderLyrics()}
      </div>

      <div className="w-full flex justify-center">
        <input
          className="bg-[#2b2b2b] border-none rounded-lg px-4 py-2 w-full max-w-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
          type="text"
          placeholder="Type here"
          onChange={handleInputChange}
          onKeyDown={handleSpaceKey}
          value={currentText}
          ref={inputRef}
        />
      </div>

      <div className="text-[0.5rem] py-1">
        <p>
          Line: {lineIndex + 1} / {lines.length} | Word: {wordIndex + 1} /{" "}
          {lines[lineIndex]?.length || 0} | Current word:{" "}
          {lines[lineIndex]?.[wordIndex] || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default Typingverse;
