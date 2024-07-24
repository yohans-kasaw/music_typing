import Test from './Test'
import TopBar from './topBar'
import { SongDetails } from '../domain/lyrics'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAvailableSongNames, fetchSongDetails } from '../state_manager/store'

function screen() {

  const songFetchError = useSelector((state: any) => state.songFetchError);
  const songData : SongDetails = useSelector((state: any) => state.songData);
  const selectedSongName = useSelector((state: any) => state.selectedSongName);
  const availableSongNames = useSelector((state: any) => state.availableSongNames);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSongDetails(selectedSongName || "Blinding"));
    dispatch(fetchAvailableSongNames())

  }, [dispatch, selectedSongName])

  if (!songData) {
    return <div>Loading...</div>;
  }

  return (
    //flex flex-col items-center justify-center h-screen  text-white
    <div className='w-screen h-screen flex justify-center items-center bg-red-300 bg-gradient-to-b from-[#1a1a1a] to-[#2b2b2b]'>
      <div className='max-w-3xl w-full px-6 py-8 bg-[#1a1a1a] rounded-lg shadow-lg'>
        <TopBar availableSongNames={availableSongNames} />
        {songFetchError ? <div>Error fetching song details</div> : null}
        {songData ? <Test songData={songData} /> : <div>Loading...</div>}
      </div>
    </div>
  )
}

export default screen
