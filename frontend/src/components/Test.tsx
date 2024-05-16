import { useState, useEffect, useRef } from "react"
import Letter from "./Letter";


interface Lyrics {
  lyrics: string,
  title: string,
  artist: string,
  album: string,
}

function Test() {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current && inputRef.current)
      inputRef.current.focus();
  }, []);

  const [jsonData, setJsonData] = useState('noting here');

  useEffect(() => {
    fetch('/public/lyrics/save_your_tears.json').then(response => response.json()).then(data => {
      if (!data) return;
      setJsonData(data.lyrics)
    })
  }, []);

  const testingText = jsonData

  if (!testingText)
    return <div>Loading...</div>;

  // load a json file form assets folder
  //
  let lines = jsonData.split('\n').map((line: string) => line.trim().split(' '));



  let [currentText, setCurrentText] = useState("")
  let [lineIndex, setLineIndex] = useState(0)
  let [wordIndex, setWordIndex] = useState(0)
  let [currentWordError, setCurrentWordError] = useState(false)

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

  function isCurrentWord(i: number, j: number) {
    return i === lineIndex && j === wordIndex
  }

  function getCurrentWordColor() {
    return currentWordError ? 'red' : 'blue'
  }

  return (
    <>
      <div className="bg-gray-900 p-6 rounded-lg shadow-md h-1/2 overflow-scroll">
        {
          lines.map((line, i) => {
            return (
              <p>
                <span>{line.map((word, j) => {

                  return (<span><span style={{ backgroundColor: isCurrentWord(i, j) ? getCurrentWordColor() : '' }}>{word.split('').map((l) => <Letter>{l}</Letter>)

                  }</span> </span>)
                })}</span>
              </p>
            )
          })
        }
      </div>

      <div>
        {wordIndex} {lineIndex} {currentText} x<span>{lines[lineIndex][wordIndex]}</span>x
      </div>

      <div className="mt-4">
        <input
          className={`w-full p-2 border rounded-md focus:outline-none 
                        ${currentWordError ? 'border-red-500 focus:ring-red-500' : 'border-blue-500 focus:ring-blue-500'} 
                        focus:border-transparent`}
          style={{ borderColor: currentWordError ? 'red' : 'blue' }}
          type="text"
          placeholder="Type here"
          onChange={(e) => setCurrentText(e.target.value)}
          onKeyDown={spaceKeyHandler}
          value={currentText}
          ref={inputRef}
        />
      </div>
    </>
  )
}

export default Test
