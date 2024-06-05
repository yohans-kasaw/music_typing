import Test from './Test'
import TopBar from './topBar'
import { SongDetails } from '../domain/lyrics'
import { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {fetchAllIds} from '../store/lyrics_slice'
import { useGetAllIdsQuery } from '../store/lyrics_api'

function screen() {

  const [songData, setSongData] = useState<SongDetails | null>(null);

  let dispatch = useDispatch()


  useEffect(() => {
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

    dispatch(fetchAllIds())
    fetchSongDetails();
  }, []);


  const { data, error, isLoading } = useGetAllIdsQuery()
  console.log('-------------')
  console.log(data)
  console.log(useSelector((state) => state))


  if (!songData) {
    return <div>Loading...</div>;
  }


  return (
    //flex flex-col items-center justify-center h-screen  text-white
    <div className='w-screen h-screen flex justify-center items-center bg-red-300 bg-gradient-to-b from-[#1a1a1a] to-[#2b2b2b]'>
      <div className='max-w-3xl w-full px-6 py-8 bg-[#1a1a1a] rounded-lg shadow-lg'>
        <TopBar />
        <Test songData={songData} />
      </div>
    </div>
  )
}

export default screen
