import { useEffect, useMemo, useState } from 'react'
import LayoutOne from '../components/LayoutOne'

import logger from '@/logger.js'

function About() {
  const [count, setcount] = useState(0)
  const [count2, setcount2] = useState(0)

  useEffect(() => {}, [])
  const inc = () => {
    setcount((p) => p + 1)
  }
  const inc2 = () => {
    setcount2((p) => p + 1)
  }
  return (
    <LayoutOne>
      <h1>About</h1>
      <p>
        A series of different drills to help improve your vocabulary in
        different languages
      </p>
    </LayoutOne>
  )
}

export default About
