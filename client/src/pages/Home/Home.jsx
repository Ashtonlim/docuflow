import LayoutOne from '@/components/LayoutOne'
import { uploadPDF } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import FileUploader from '@/components/FileUploader'

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]

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
      <div className='flex flex-col'>
        <h4>Create Template to Extract Fields from PDFs </h4>
        <div>
          Select areas of your PDF you wish to automate extracting text from.
          Save this template to be used on other PDFs.
        </div>

        <FileUploader
          label='Upload PDF to extract from'
          onFileChange={onFileChange}
        />
      </div>
    </LayoutOne>
  )
}
