import About from '@/pages/About/About.jsx'
import Home from '@/pages/Home/Home.jsx'
import TemplateManager from '@/pages/TemplateManager/TemplateManager.jsx'
import Templates from '@/pages/Templates/Templates.jsx'
import Targets from '@/pages/Targets/Targets.jsx'
import Extract from '@/pages/Extract/Extract.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'

import config from '@/config.js'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const App = () => {
  return (
    <BrowserRouter basename={config.BASE_PATH}>
      <Routes>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='targets' element={<Targets />} />
        <Route path='templates/extract/:id' element={<Extract />} />
        <Route path='templates' element={<Templates />} />
        <Route path='templates/:id' element={<TemplateManager />} />

        {/* Catch-all route for undefined paths */}
        {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
