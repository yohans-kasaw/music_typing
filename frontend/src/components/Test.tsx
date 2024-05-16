import { useState, useEffect, useRef } from "react"
import Letter from "./Letter";

import { SongDetails } from "../domain/lyrics";

function Test() {
  const inputRef = useRef<HTMLInputElement>(null);

  let [currentText, setCurrentText] = useState("")
  let [lineIndex, setLineIndex] = useState(0)
  let [wordIndex, setWordIndex] = useState(0)
  let [currentWordError, setCurrentWordError] = useState(false)

  const [songData, setSongData] = useState<SongDetails | null>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current)
      inputRef.current.focus();
    const fetchSongDetails = async () => {
      try {
        const response = await fetch('/public/lyrics/Blinding.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: SongDetails = await response.json();
        setSongData(data);
      } catch (error) {
        throw new Error('Error fetching song details');
      }
    };

    fetchSongDetails();
  }, []);

  if (!songData) {
    return <div>Loading...</div>;
  }

  const { lyrics } = songData;

  let lines = lyrics.split('\n').map((line: string) => line.trim().split(' '));
  // slice the line after index 13
  lines = lines.slice(13, 20);


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

  function isCurrentWord(i: number, j: number) {
    return i === lineIndex && j === wordIndex
  }

  function getCurrentWordColor() {
    return currentWordError ? 'red' : 'blue'
  }

  function wordIsTyped(i: number, j: number) {
    return i < lineIndex || (i === lineIndex && j < wordIndex)
  }

  return (
    <>
      <div className="bg-gray-900 p-6 rounded-lg shadow-md h-1/2 overflow-scroll">
        {
          lines.map((line, i) => {
            return (
              <p>
                <span>{line.map((word, j) => {

                  return (<span><span style={{ backgroundColor: isCurrentWord(i, j) ? getCurrentWordColor() : '', color: wordIsTyped(i, j) ? 'green' : '' }}>{word.split('').map((l) => <Letter>{l}</Letter>)

                  }</span> </span>)
                })}</span>
              </p>
            )
          })
        }
      </div>
      <div className="mt-4">
        <p>Line: {lineIndex + 1}</p>
        <p>Word: {wordIndex + 1}</p>
        <p>Current word: {lines[lineIndex][wordIndex]}</p>
      </div>
      <div className="mt-4">
        <input
          className={`w-full p-2 border rounded-md focus:outline-none 
                        ${currentWordError ? 'border-red-500 focus:ring-red-500' : 'border-blue-500 focus:ring-blue-500'} 
                        focus:border-transparent`}
          style={{ borderColor: currentWordError ? 'red' : 'blue' }}
          type="text"
          placeholder="Type here"
          onChange={onInputChange}
          onKeyDown={spaceKeyHandler}
          value={currentText}
          ref={inputRef}
        />
      </div>
    </>
  )
}

export default Test
