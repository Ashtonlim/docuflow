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
import Steps from '@/components/Steps'
import Button from '@/components/Button'
import FPSpinner from '@/components/FullPageSpinner'

import PdfDoc from '@/components/PdfDoc'

// import PdfPage from '@/components/PdfPage'
// import PdfOverlay from '@/components/PdfOverlay'
// import { Document } from 'react-pdf'
// import SelectedWordsList from '@/components/SelectedWordsList'
// import { options } from '@/utils/constants'

export default function Extract() {
  const [sourceFile, setSourceFile] = useState(null)
  const [targetFile, setTargetFile] = useState(null)

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
    setSourceFile(pdfSourceData.url)

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

  return (
    <LayoutOne>
      <div className='flex flex-col'>
        <div className='flex w-full flex-row justify-center'>
          <Steps at={0} />
        </div>
        <h4>Upload PDF</h4>
        <span>Link preselected fields from the source PDF to a target PDF</span>
        {template && (
          <div>{`Number of fields: ${template.bounding_boxes.length}`}</div>
        )}
        {!targetFile ? (
          <FileUploader label='Upload target PDF' onFileChange={onFileChange} />
        ) : (
          <div className='mt-4 flex flex-col'>
            <div>
              Current Step: Verify the text extraction is correct to move on to
            </div>
            <Button>Extract and save fields</Button>
          </div>
        )}
        <div className='mt-5 grid grid-cols-2 gap-3'>
          <div>
            {sourceFile && (
              <PdfDoc
                fileURL={sourceFile}
                bounding_boxes={template.bounding_boxes}
              />
            )}
          </div>

          <div>
            {targetFile && <PdfDoc fileURL={targetFile} bounding_boxes={[]} />}
          </div>
        </div>
      </div>
    </LayoutOne>
  )
}
