const FileUploader = ({ onFileChange }) => {
  return (
    <div>
      <input
        onChange={onFileChange}
        className='file-input'
        type='file'
        accept='application/pdf'
      />
    </div>
  )
}

export default FileUploader
