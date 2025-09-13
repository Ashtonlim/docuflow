import About from '@/pages/About/About.jsx'
import Home from '@/pages/Home/Home.jsx'
import Resources from '@/pages/Resources/Resources.jsx'
import Templates from '@/pages/Templates/Templates.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'

import config from '@/config.js'

const App = () => {
  return (
    <BrowserRouter basename={config.BASE_PATH}>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path='about' element={<About />}></Route>
        <Route path='resources' element={<Resources />}></Route>
        <Route path='Templates' element={<Templates />}></Route>

        {/* Catch-all route for undefined paths */}
        {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
