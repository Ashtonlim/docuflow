import LayoutOne from '@/components/LayoutOne'
import config from '@/config'
import { useEffect, useState } from 'react'
import { Document } from 'react-pdf'
import { useCreateTemplateMutation } from '@/features/template/templateSlice'

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
  const [createTemplate, { isLoading, isUpdating }] =
    useCreateTemplateMutation()

  const { id } = useParams()

  const [pages, setPages] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [templateName, setTemplateName] = useState('')

  useEffect(() => {
    const getFile = async () => {
      const res = await fetch(`${config.API_URL}/documents/${id}`)
      if (!res.ok) {
        console.error('failed to get file', res)
      }
      const blob = await res.blob()
      // NOTE: Passing a raw fetch Blob or File to react-pdf can fail on route navigation
      // because PDF.js worker may try to read the stream before the Blob is fully realized.
      // Using URL.createObjectURL(blob) creates a stable object URL that PDF.js can reliably fetch,
      // ensuring consistent rendering across navigation and remounts.
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    }
    getFile()
  }, [])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPages(numPages)
  }

  // console.log(pdf.bounding_boxes)
  const handleCreateTemplate = () => {
    const payload = {
      file_id: id,
      created_by: 1,
      name: templateName,
      bounding_boxes: pdf.bounding_boxes,
      description: 'test',
    }
    createTemplate(payload)
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

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>Template Name</legend>
            <input
              onChange={(e) => setTemplateName(e.target.value)}
              value={templateName}
              type='text'
              className='input'
              placeholder='Give your template a name'
            />
            {/* <p className='label'>Optional</p> */}
          </fieldset>

          {/* <label htmlFor='templateName'>Template Name</label>
          <input
            // aria-label='Upload PDF File'
            onChange={(e) => setTemplateName(e.target.value)}
            value={templateName}
            type='text'
            id='templateName'
            name='templateName'
          /> */}

          {pdfUrl && (
            <button
              onClick={handleCreateTemplate}
              className='btn btn-soft mt-3'
            >
              Save Template
            </button>
          )}
        </div>
        <div className='pdfviewer__container'>
          {pdfUrl && (
            <div className='pdfviewer__container__document'>
              <Document
                key={pdfUrl}
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
              >
                {pages
                  ? [...Array(pages).keys()].map((pageNumber) => (
                      <div key={`pg_${pageNumber + 1}`} className='ruRow'>
                        <PDFPage page_number={pageNumber + 1} />
                        <SelectedFields page_number={pageNumber + 1} />
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
