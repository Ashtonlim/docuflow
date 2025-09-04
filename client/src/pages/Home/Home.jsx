import { useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import './Sample.css'
import FileUploader from './FileUploader'
import PDFPage from './PDFPage'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  wasmUrl: '/wasm/',
}

export default function Home() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState()
  // const [pageText, setPageText] = useState({})
  const [savedCoords, setsavedCoords] = useState({})

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]
    if (nextFile) {
      setFile(nextFile)
    }
  }

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages)
  }

  return (
    <div className='pdfviewer'>
      <header>
        <h1>react-pdf sample page</h1>
      </header>
      <div className='pdfviewer__container'>
        <FileUploader onFileChange={onFileChange} />
        {file && (
          <div className='pdfviewer__container__document'>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
              {Array.from(new Array(numPages), (_el, index) => (
                // <Page pageNumber={index + 1} />
                // <PDFPage pageNumber={index + 1} />
                <PDFPage
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  // pageText={pageText}
                  // setPageText={setPageText}
                  savedCoords={savedCoords}
                  setsavedCoords={setsavedCoords}
                />
              ))}
            </Document>
          </div>
        )}
      </div>
    </div>
  )
}
