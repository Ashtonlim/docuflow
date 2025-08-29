import { useEffect, useMemo, useState } from 'react'
import LayoutOne from '../components/LayoutOne'
import Stat from './Stat.jsx'

function Home() {
  useEffect(() => {}, [])

  return (
    <LayoutOne>
      <div className='ruCol mb-5'>
        <h1 className='hoverable-text mb-3'>Match the Words</h1>
        <Stat correct={score} total={tries} />
      </div>
      {/* <div className='mx-auto grid w-full grid-flow-col grid-cols-[30%_70%] grid-rows-[auto_auto_auto_auto_auto] gap-x-12 gap-y-4 lg:w-2/5'> */}
      <div>hi</div>
    </LayoutOne>
  )
}

export default Home
