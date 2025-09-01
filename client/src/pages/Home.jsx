import { useEffect, useRef, useState } from 'react'
import LayoutOne from '../components/LayoutOne'

import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
// https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.js?import net::ERR_ABORTED 404 (Not Found)
function Home() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [selectedText, setSelectedText] = useState('')
  const textLayerRef = useRef(null)
  // useEffect(() => {}, [])
  function onFileChange(e) {
    const { files } = e.target
    const nextFile = files?.[0]

    if (nextFile) {
      setFile(nextFile)
    }
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages)
  }

  function handleMouseUp() {
    const selection = window.getSelection()
    if (selection && selection.toString().trim() !== '') {
      setSelectedText(selection.toString())
    }
  }

  return (
    <LayoutOne>
      <div className='ruCol mb-5'>
        <h1 className='hoverable-text mb-3'>Upload your PDF</h1>
      </div>

      <div>
        <input type='file' onChange={onFileChange} />
        {file && (
          <div>
            <div>File Name: {file.name}</div>
            <div>File Type: {file.type}</div>
          </div>
        )}

        {file && (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (_el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={1000}
              />
            ))}
          </Document>
        )}
      </div>
    </LayoutOne>
  )
}

export default Home
