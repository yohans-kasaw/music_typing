import { useState, useEffect, useRef } from "react"
import Letter from "./Letter";
import { SongDetails } from "../domain/lyrics";

function Test({ songData }: { songData: SongDetails }) {
  const inputRef = useRef<HTMLInputElement>(null);

  let [currentText, setCurrentText] = useState("")
  let [lineIndex, setLineIndex] = useState(0)
  let [wordIndex, setWordIndex] = useState(0)
  let [currentWordError, setCurrentWordError] = useState(false)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [songData]);

  const { lyrics } = songData;

  let lines = lyrics.split('\n').map((line: string) => line.trim().split(' '));

  function spaceKeyHandler(e: any) {
    if (e.key === " ") {
      e.preventDefault()
      e.stopPropagation()
      if (currentText === lines[lineIndex][wordIndex]) {
        setCurrentWordError(false)
        setCurrentText("")
        if (wordIndex + 1 === lines[lineIndex].length) {
          setWordIndex(0)
          setLineIndex(lineIndex + 1)

          return
        }
        setWordIndex(wordIndex + 1)
      } else {
        setCurrentWordError(true)
      }
    }
  }

  function onInputChange(e: any) {
    let inputText = e.target.value
    let inputTextLength = inputText.length
    setCurrentText(inputText)

    // if length less than or equal, and so far correct
    if (inputTextLength <= lines[lineIndex][wordIndex].length && lines[lineIndex][wordIndex].startsWith(inputText)) {
      setCurrentWordError(false)
    } else {
      setCurrentWordError(true)
    }
  }

  function isLineVisible(i: number, numberOfLines: number = 3): boolean {
    const start = Math.max(0, Math.min(lineIndex - Math.floor(numberOfLines / 2), lines.length - numberOfLines));
    const end = Math.min(lines.length - 1, start + numberOfLines - 1);
    return i >= start && i <= end;
  }


  function isCurrentWord(i: number, j: number) {
    return i === lineIndex && j === wordIndex
  }

  function wordIsTyped(i: number, j: number) {
    return i < lineIndex || (i === lineIndex && j < wordIndex)
  }

  function getClass(i: number, j: number) {
    if (wordIsTyped(i, j)) {
      return 'text-green-400'
    }

    if (isCurrentWord(i, j)) {
      return currentWordError ? 'bg-red-800 font-bold text-white-900' : 'font-bold text-[#ff6b6b]'
    }


  }

  return (
    <div>

      <div className="bg-[#2b2b2b] rounded-lg p-6 mb-6 flex flex-col items-center">
        {
          lines.map((line, i) => {
            if (!isLineVisible(i, 5)) {
              return null;
            }
            return (
              <p>
                <span>{line.map((word, j) => {

                  return (<span><span className={getClass(i, j)} >{word.split('').map((l) => <Letter>{l}</Letter>)

                  }</span> </span>)
                })}</span>
              </p>
            )
          })
        }
      </div>

      <div className="w-full flex justify-center">
        <input
          className="bg-[#2b2b2b] border-none rounded-lg px-4 py-2 w-full max-w-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
          type="text"
          placeholder="Type here"
          onChange={onInputChange}
          onKeyDown={spaceKeyHandler}
          value={currentText}
          ref={inputRef}
        />
      </div>
      <div className="text-[0.5rem] py-1">
        <p>Line: {lineIndex + 1} /
          Word: {wordIndex + 1} /
          Current word: {lines[lineIndex][wordIndex]}</p>
      </div>
    </div>
  )
}

export default Test
