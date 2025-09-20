import LayoutOne from '@/components/LayoutOne'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileUploader from './FileUploader'
import { useParams } from 'react-router'
import { useGetTemplateQuery } from '@/features/template/templateSlice'
import { reInitFile } from '@/features/pdf/pdfSlice'
import PDFPage from './PDFPage'
import { Document } from 'react-pdf'
import SelectedFields from './SelectedFields'
const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  wasmUrl: '/wasm/',
}

export default function Extract() {
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState(0)

  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const { id } = useParams()

  const { data: template, isError, isLoading } = useGetTemplateQuery(id)

  useEffect(() => {
    console.info(template)
    if (template) {
      dispatch(reInitFile(template))
    }
  }, [template])

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]
    if (nextFile) {
      setFile(nextFile)
    }
  }
  const onDocumentLoadSuccess = ({ numPages }) => {
    setPages(numPages)
  }
  return (
    <LayoutOne>
      <div className='ruCol'>
        <h4>Extract Fields from PDF </h4>
        {template ? (
          <div>{`Number of fields:  ${template.bounding_boxes.length}`}</div>
        ) : (
          ''
        )}

        <FileUploader onFileChange={onFileChange} />

        <div className='pdfviewer'>
          <div className='pdfviewer__container'>
            {file && (
              <div className='pdfviewer__container__document'>
                <Document
                  // key={file}
                  file={file}
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
      </div>
    </LayoutOne>
  )
}
