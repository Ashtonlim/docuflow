import { useId } from 'react'

const FileUploader = ({ onFileChange }) => {
  const fileId = useId()

  return (
    <div className='Example__container__load'>
      <label htmlFor={fileId}>Load from file:</label>{' '}
      <input
        id={fileId}
        onChange={onFileChange}
        type='file'
        accept='application/pdf'
      />
    </div>
  )
}

export default FileUploader
