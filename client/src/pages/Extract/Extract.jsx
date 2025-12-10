import { useState } from 'react'
import { useParams } from 'react-router'

import Steps from '@/components/Steps'
import Button from '@/components/Button'
import PdfDoc from '@/components/PdfDoc'
import FileUploader from '@/components/FileUploader'
import LayoutOne from '@/components/LayoutOne'

import { uploadPDF } from '@/features/pdf/pdfSlice'
import { useDispatch } from 'react-redux'

export default function Extract() {
  const [targetFile, setTargetFile] = useState(null)
  const { pdf_id, template_id } = useParams()
  const dispatch = useDispatch()

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
            <PdfDoc pdf_id={pdf_id} template_id={template_id} />
          </div>

          <div>
            {targetFile ? (
              <PdfDoc pdfURL={targetFile} />
            ) : (
              <div>Upload a target PDF file to Link input fields.</div>
            )}
          </div>
        </div>
      </div>
    </LayoutOne>
  )
}
