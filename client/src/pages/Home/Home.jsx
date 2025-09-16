import LayoutOne from '@/components/LayoutOne'
import { uploadPDF } from '@/features/pdf/pdfSlice'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import FileUploader from './FileUploader'

export default function Home() {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]
    console.log('found file', nextFile, pdf)
    if (nextFile) {
      setFile(nextFile)
    }

    dispatch(uploadPDF(nextFile))
      .unwrap()
      .then((res) => {
        console.log('from home', res)
        navigate(`/templates/${res.id}`)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <LayoutOne>
      <div className='pdfviewer'>
        <div className='ruCol'>
          <h4>Create Template to Extract Fields from PDFs </h4>
          <div>
            Select areas of your PDF you wish to automate extracting text from.
            Save this template to be used on other PDFs.
          </div>

          {file === null && <FileUploader onFileChange={onFileChange} />}
        </div>
      </div>
    </LayoutOne>
  )
}
