import LayoutOne from '@/components/LayoutOne'
import { initFile } from '@/features/pdf/pdfSlice'
import { useState } from 'react'
import { Document, pdfjs } from 'react-pdf'
import { useDispatch, useSelector } from 'react-redux'
import FileUploader from './FileUploader'
import PDFPage from './PDFPage'
import SelectedFields from './SelectedFields'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

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
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState(0)

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]
    console.log('found file'.nextFile)
    if (nextFile) {
      setFile(nextFile)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    const { name, size, type } = file
    dispatch(initFile({ name, size, type, numPages }))
    setPages(numPages)
  }

  return (
    <LayoutOne>
      <div className='pdfviewer'>
        <h4>Create Template to Extract Fields from PDFs </h4>
        <div>
          Select areas of your PDF you wish to automate extracting text from.
          Save this template to be used on other PDFs.
        </div>

        <div className='pdfviewer__container'>
          <FileUploader onFileChange={onFileChange} />
          {file && (
            <div className='pdfviewer__container__document'>
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
              >
                {[...Array(pages).keys()].map((pageNumber) => (
                  <div className='ruRow'>
                    <PDFPage
                      key={`pg_${pageNumber + 1}`}
                      pageNumber={pageNumber + 1}
                    />
                    <SelectedFields pageNumber={pageNumber + 1} />
                  </div>
                ))}
              </Document>
            </div>
          )}
        </div>
      </div>
    </LayoutOne>
  )
}
