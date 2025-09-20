const FileUploader = ({ onFileChange }) => {
  return (
    <div className='ruCol mt-4'>
      <label htmlFor='extractpdf'>Upload PDF to extract from</label>
      <input
        // aria-label='Upload PDF File'
        onChange={onFileChange}
        className='file-input'
        type='file'
        accept='application/pdf'
        id='extractpdf'
        name='extractpdf'
      />
    </div>
  )
}

export default FileUploader
