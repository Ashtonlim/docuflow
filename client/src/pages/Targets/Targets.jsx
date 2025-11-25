import LayoutOne from '@/components/LayoutOne'
import { uploadPDF } from '@/features/pdf/pdfSlice'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import FileUploader from '@/components/FileUploader'
import { Document } from 'react-pdf'
import PdfOverlay from '@/components/PdfOverlay'
import PdfPage from '@/components/PdfPage'
import { options } from '../../utils/constants'
import SelectedWordsList from '../../components/SelectedWordsList'

export default function Targets() {
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState(null)

  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]
    if (nextFile) {
      setFile(nextFile)
    }

    // dispatch(uploadPDF(nextFile))
    //   .unwrap()
    //   .then((res) => {
    //     navigate(`/templates/${res.id}`)
    //   })
    //   .catch((err) => {
    //     throw new Error(err)
    //   })
  }
  const onDocumentLoadSuccess = ({ numPages }) => {
    setPages(numPages)
  }

  return (
    <LayoutOne>
      <div className='flex flex-col'>
        <h4>Upload Target PDFs</h4>
        <div>
          Target PDFs are files you wish to insert text into from values
          extracted from a template against a base PDF
        </div>

        {file === null && <FileUploader onFileChange={onFileChange} />}
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
                      <div
                        key={`pg_${pageNumber + 1}`}
                        className='flex flex-row'
                      >
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
