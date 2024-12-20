interface Metadata {
  [key: string]: string;
}

interface Lyric {
  time: number;
  text: string;
}

export interface ParsedLRC {
  metadata: Metadata;
  lyrics: Lyric[];
}

function parseLRC(lrcContent: string): ParsedLRC {
  const lines = lrcContent.split("\n");
  const metadata: Metadata = {};
  const lyrics: Lyric[] = [];

  if (lines.length === 0) {
    throw new Error("Empty LRC content provided.");
  }

  lines.forEach((line) => {
    line = line.trim();

    // Parse metadata (e.g., [ti:Song Title])
    const metadataMatch = line.match(/^\[(\w+):(.*)\]$/);
    if (metadataMatch) {
      const key = metadataMatch[1].toLowerCase();
      const value = metadataMatch[2].trim();
      metadata[key] = value;
      return;
    }

    // Parse lyrics with timestamps (e.g., [00:12.34]Line of lyrics)
    const lyricMatch = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
    if (lyricMatch) {
      const minutes = parseInt(lyricMatch[1], 10);
      const seconds = parseFloat(lyricMatch[2]);
      const time = minutes * 60 + seconds;
      const text = lyricMatch[3].trim();

      lyrics.push({ time, text });
      return;
    }
  });

  if (Object.keys(metadata).length === 0 && lyrics.length === 0) {
    throw new Error("No valid metadata or lyrics found in LRC content.");
  }

  return { metadata, lyrics };
}

export default parseLRC;
