import json
import re
import argparse
import os
import subprocess

def save_lyrics_to_json(lyrics, title, artist, album, filename):
    # Replace new lines with \n
    # Remove words inside parentheses and square brackets
    lyrics = re.sub(r'\[.*?\]', '', lyrics)
    lyrics = re.sub(r'\(.*?\)', '', lyrics)
    
    # Create the song details dictionary
    song_details = {
        "lyrics": lyrics,
        "title": title,
        "artist": artist,
        "album": album
    }
    
    # Save the song details as a JSON file
    with open(filename, 'w') as json_file:
        json.dump(song_details, json_file, indent=4)

def main():
    parser = argparse.ArgumentParser(description='Process song lyrics and save as JSON.')
    parser.add_argument('--lyrics', type=str, help='Lyrics of the song as a string.')
    parser.add_argument('--lyrics-file', type=str, help='Path to the file containing lyrics.')
    parser.add_argument('--title', type=str, default='Unknown Title', help='Title of the song.')
    parser.add_argument('--artist', type=str, default='Unknown Artist', help='Artist of the song.')
    parser.add_argument('--album', type=str, default='Unknown Album', help='Album of the song.')
    parser.add_argument('--output', type=str, help='Output file path for the JSON file.')

    args = parser.parse_args()

    if args.lyrics_file:
        with open(args.lyrics_file, 'r') as file:
            lyrics = file.read()
    elif args.lyrics:
        lyrics = args.lyrics
    else:
        # Use xclip to get clipboard contents if no lyrics or lyrics file is provided
        try:
            result = subprocess.run(['xclip', '-selection', 'clipboard', '-o'], capture_output=True, text=True)
            lyrics = result.stdout
        except FileNotFoundError:
            print("Error: xclip is not installed. Please install it and try again.")
            return

    if not lyrics:
        print("Error: No lyrics provided through argument, file, or clipboard.")
        return

    if args.output:
        output_path = args.output
    else:
        output_path = os.path.join(os.getcwd(), 'song_details.json')

    save_lyrics_to_json(lyrics, args.title, args.artist, args.album, output_path)
    print(f"Lyrics saved to {output_path}")

if __name__ == "__main__":
    main()
