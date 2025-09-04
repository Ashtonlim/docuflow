import Home from '@/pages/Home/Home.jsx'
import About from '@/pages/About/About.jsx'
import Resources from '@/pages/Resources/Resources.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import config from '@/config.js'

const App = () => {
  return (
    <BrowserRouter basename={config.BASE_PATH}>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path='about' element={<About />}></Route>
        <Route path='resources' element={<Resources />}></Route>

        {/* Catch-all route for undefined paths */}
        {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
