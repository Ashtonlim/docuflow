import { useEffect, useRef, useState } from 'react'
import LayoutOne from '../../components/LayoutOne'

import logger from '@/logger.js'

function About() {
  const [count, setcount] = useState(0)
  const [count2, setcount2] = useState(0)
  const [name, setName] = useState('')
  const prevName = useRef()

  useEffect(() => {
    prevName.current = name
    // setcount2((p) => p + 1)
  }, [name])

  const handleNameChange = (e) => {
    setName(e.target.value)
    setcount((p) => p + 1)
  }
  const update = () => {}
  return (
    <LayoutOne>
      <h1>About</h1>
      <input value={name} onChange={handleNameChange} />
      <div>I have been rendered {count} times</div>
      <div>My name was {prevName.current}</div>
      <button onClick={update}>Update</button>
    </LayoutOne>
  )
}

export default About
