import LayoutOne from '@/components/LayoutOne'
import { uploadPDF } from '@/features/pdf/pdfSlice'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import FileUploader from '@/components/FileUploader'

export default function Targets() {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]
    if (nextFile) {
      setFile(nextFile)
    }

    dispatch(uploadPDF(nextFile))
      .unwrap()
      .then((res) => {
        navigate(`/templates/${res.id}`)
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  return (
    <LayoutOne>
      <div className='ruCol'>
        <h4>Upload Target PDFs</h4>
        <div>
          Target PDFs are files you wish to insert text into from values
          extracted from a template against a base PDF
        </div>

        {file === null && <FileUploader onFileChange={onFileChange} />}
      </div>
    </LayoutOne>
  )
}
