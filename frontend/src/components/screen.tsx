import Test from './Test'
import TopBar from './topBar'

function screen() {
  return (
    //flex flex-col items-center justify-center h-screen  text-white
    <div className='w-screen h-screen flex justify-center items-center bg-red-300 bg-gradient-to-b from-[#1a1a1a] to-[#2b2b2b]'>
      <div className='max-w-3xl w-full px-6 py-8 bg-[#1a1a1a] rounded-lg shadow-lg'>
        <TopBar />
        <Test />
      </div>
    </div>
  )
}

export default screen
