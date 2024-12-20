import * as fs from 'fs';
import * as path from 'path';

/**
 * Retrieves paired file paths from 'public/lrc' and 'public/audio' directories.
 * @returns {FilePair[]} Array of FilePair objects with matched names.
 */

// src/types/FilePair.ts
export interface FilePair {
  name: string;
  lrcPath: string;
  audioPath: string;
}


export function getFilePairs(): FilePair[] {
  const publicDir = path.resolve(__dirname, '../public');
  const lrcDir = path.join(publicDir, 'lrc');
  const audioDir = path.join(publicDir, 'audio');

  // Read filenames from both directories
  const lrcFiles = fs.existsSync(lrcDir) ? fs.readdirSync(lrcDir) : [];
  const audioFiles = fs.existsSync(audioDir) ? fs.readdirSync(audioDir) : [];

  // Create maps with base filenames as keys
  const lrcMap: Map<string, string> = new Map();
  const audioMap: Map<string, string> = new Map();

  lrcFiles.forEach((file) => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    lrcMap.set(name, `/lrc/${file}`);
  });

  audioFiles.forEach((file) => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    audioMap.set(name, `/audio/${file}`);
  });

  // Find matching names
  const pairs: FilePair[] = [];

  lrcMap.forEach((lrcPath, name) => {
    if (audioMap.has(name)) {
      pairs.push({
        name,
        lrcPath,
        audioPath: audioMap.get(name)!,
      });
    }
  });

  return pairs;
}

function writeJsonTo(json: Record<string, any>, filePath: string): void {
    try {
        const jsonString = JSON.stringify(json, null, 2); // Beautify JSON with 2 spaces
        fs.writeFileSync(filePath, jsonString, 'utf8');
        console.log(`File written successfully to ${filePath}`);
    } catch (error) {
        console.error(`Error writing JSON to file: ${(error as Error).message}`);
    }
}

const filePath: string = path.join(path.resolve(__dirname, '../public/data'), "typing_track_data.json");
const object: Record<string, any> = getFilePairs();

writeJsonTo(object, filePath);
