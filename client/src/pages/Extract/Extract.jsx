import LayoutOne from '@/components/LayoutOne'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileUploader from '@/components/FileUploader'
import { useParams } from 'react-router'
import {
  useGetTemplateQuery,
  useGetPDFQuery,
} from '@/features/template/templateSlice'
import { reInitFile } from '@/features/pdf/pdfSlice'
import PdfPage from '@/components/PdfPage'
import PdfOverlay from '@/components/PdfOverlay'
import { Document } from 'react-pdf'
import SelectedWordsList from '@/components/SelectedWordsList'
import Steps from '@/components/Steps'
import Button from '@/components/Button'
import { options } from '@/utils/constants'
import FPSpinner from '@/components/FullPageSpinner'

export default function Extract() {
  const [baseFile, setBaseFile] = useState(null)
  const [targetFile, setTargetFile] = useState(null)
  const [basePages, setBasePages] = useState(null)
  const [targetPages, setTargetPages] = useState(null)

  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const { pdf_id, template_id } = useParams()

  const {
    data: template,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
  } = useGetTemplateQuery(template_id)

  const {
    data: pdfSourceData,
    isLoading: isPDFLoading,
    isError: isPDFError,
  } = useGetPDFQuery(pdf_id)

  useEffect(() => {
    if (!template || !pdfSourceData) {
      return
    }
    dispatch(reInitFile(template))
    setBaseFile(pdfSourceData.url)

    return () => URL.revokeObjectURL(pdfSourceData.url) // prevents memory leak
  }, [pdfSourceData])

  if (isPDFLoading || isTemplateLoading) {
    return <FPSpinner />
  }

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]
    if (nextFile) {
      setTargetFile(nextFile)
    }
  }
  const onBaseLoadSuccess = ({ numPages }) => {
    setBasePages(numPages)
  }

  const onTargetLoadSuccess = ({ numPages }) => {
    setTargetPages(numPages)
  }

  const onLoadError = (error) => {
    console.error(`Error to load PDF: ${error.message}`)
  }

  return (
    <LayoutOne>
      <div className='ruCol'>
        <div className='flex w-full flex-row justify-center'>
          <Steps at={0} />
        </div>
        <h4>Upload PDF</h4>
        <span>Link preselected fields from the base PDF to a target PDF</span>
        {template && (
          <div>{`Number of fields: ${template.bounding_boxes.length}`}</div>
        )}
        {!targetFile ? (
          <FileUploader label='Upload target PDF' onFileChange={onFileChange} />
        ) : (
          <div className='ruCol mt-4'>
            <div>
              Current Step: Verify the text extraction is correct to move on to
            </div>
            <Button>Extract and save fields</Button>
          </div>
        )}
        <div>
          <div className=''>
            <div className=''>
              {baseFile && (
                <div className=''>
                  <Document
                    key={baseFile}
                    file={baseFile}
                    onLoadSuccess={onBaseLoadSuccess}
                    onLoadError={onLoadError}
                    options={options}
                  >
                    {basePages ? (
                      [...Array(basePages).keys()].map((pageNumber) => (
                        <div key={`pg_${pageNumber + 1}`} className='ruRow'>
                          <div className='relative mb-3 inline-block'>
                            <PdfPage page_number={pageNumber + 1} />
                            <PdfOverlay
                              page_number={pageNumber + 1}
                              editable={false}
                            />
                          </div>
                          <SelectedWordsList page_number={pageNumber + 1} />
                        </div>
                      ))
                    ) : (
                      <div>0 pages found in PDF</div>
                    )}
                  </Document>
                </div>
              )}
            </div>
          </div>

          <div className='pdfviewer'>
            <div className='pdfviewer__container'>
              {targetFile && (
                <div className='pdfviewer__container__document'>
                  <Document
                    key={targetFile}
                    file={targetFile}
                    onLoadSuccess={onTargetLoadSuccess}
                    options={options}
                  >
                    {targetPages
                      ? [...Array(targetPages).keys()].map((pageNumber) => (
                          <div key={`pg_${pageNumber + 1}`} className='ruRow'>
                            <div className='relative mt-3 inline-block'>
                              <PdfPage page_number={pageNumber + 1} />
                              <PdfOverlay
                                page_number={pageNumber + 1}
                                editable={false}
                              />
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
        </div>
      </div>
    </LayoutOne>
  )
}
