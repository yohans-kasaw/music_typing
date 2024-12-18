// export top bar with two icans on left and the other on right
import { useDispatch } from "react-redux";
export default function TopBar({availableSongNames}: { availableSongNames: string[] | null }) {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <MusicIcon className="w-6 h-6 mr-2" />
        {availableSongNames && (
          <select className="bg-[#2b2b2b] border-none rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]">
            {availableSongNames.map((songName: string) => (
              <option key={songName} value={songName} onClick={() => {dispatch({type:"SELECT_SONG_NAME", payload:songName})}}>
                {songName}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center">
        <Volume2Icon className="w-6 h-6 mr-2" />
        <span>Volume</span>
      </div>
    </div>
  );
}


function Volume2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
