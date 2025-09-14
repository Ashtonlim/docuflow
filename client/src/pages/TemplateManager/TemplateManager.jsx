import LayoutOne from '@/components/LayoutOne'
import config from '@/config'
import { useEffect, useState } from 'react'
import { Document } from 'react-pdf'

import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import PDFPage from './PDFPage'
import SelectedFields from './SelectedFields'

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  wasmUrl: '/wasm/',
}

// const loc = useLocation()
export default function TemplateManager() {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const { id } = useParams()

  const [file, setFile] = useState(null)
  const [pages, setPages] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)

  useEffect(() => {
    const getFile = async () => {
      const res = await fetch(`${config.API_URL}/documents/${id}`)
      if (!res.ok) {
        console.error('failed to get file', res)
      }
      const blob = await res.blob()
      const file = new File([blob], `${id}.pdf`, { type: blob.type })
      console.log(file)
      setFile(file)

      // const res = await fetch(
      //   `http://localhost:8000/documents/${id}`,
      // )
      // const blob = await res.blob()
      // const url = URL.createObjectURL(blob)
      // setPdfUrl(url)

      return () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      }
    }
    getFile()
  }, [])

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('loaded okay', numPages)
    setPages(numPages)
  }
  const handleCreateTemplate = () => {
    return
  }

  return (
    <LayoutOne>
      <div className='pdfviewer'>
        <div className='ruCol'>
          <h4>Create Template </h4>
          <div>
            Select areas of your PDF you wish to automate extracting text from.
            Save this template to be used on other PDFs.
          </div>

          {file && (
            <button
              onClick={handleCreateTemplate}
              className='btn btn-soft mt-3'
            >
              Save Template
            </button>
          )}
        </div>
        <div className='pdfviewer__container'>
          {file && (
            <div className='pdfviewer__container__document'>
              <Document
                key={file}
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
              >
                {pages
                  ? [...Array(pages).keys()].map((pageNumber) => (
                      <div key={`pg_${pageNumber + 1}`} className='ruRow'>
                        <PDFPage pageNumber={pageNumber + 1} />
                        <SelectedFields pageNumber={pageNumber + 1} />
                      </div>
                    ))
                  : 0}
              </Document>
            </div>
          )}
        </div>
      </div>
    </LayoutOne>
  )
}
