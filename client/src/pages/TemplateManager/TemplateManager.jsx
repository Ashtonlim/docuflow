import LayoutOne from '@/components/LayoutOne'
import config from '@/config'
import { useEffect, useState } from 'react'
import { Document } from 'react-pdf'
import { useCreateTemplateMutation } from '@/features/template/templateSlice'
import { reInitFile } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import SelectedWordsList from '../../components/SelectedWordsList'
import PdfOverlay from '@/components/PdfOverlay'
import PdfPage from '@/components/PdfPage'
import { options } from '../../utils/constants'
import SaveTemplateForm from './SaveTemplateForm'

// const loc = useLocation()
export default function TemplateManager() {
  const pdf = useSelector((state) => state.pdf)
  const [createTemplate, { isLoading, isUpdating }] =
    useCreateTemplateMutation()
  const dispatch = useDispatch()
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
    dispatch(reInitFile({ pdf_id: id }))
    getFile()
  }, [])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPages(numPages)
  }

  const handleSaveTemplate = () => {
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

          {pdfUrl && (
            <SaveTemplateForm
              templateName={templateName}
              setTemplateName={setTemplateName}
              handleSaveTemplate={handleSaveTemplate}
            />
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
                        <div className='relative mt-3 inline-block'>
                          <PdfPage page_number={pageNumber + 1} />
                          <PdfOverlay page_number={pageNumber + 1} />
                        </div>
                        <SelectedWordsList page_number={pageNumber + 1} />
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
