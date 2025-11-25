const FileUploader = ({ onFileChange, label }) => {
  return (
    <div className='ruCol my-4'>
      <label htmlFor='extractpdf'>{label}</label>
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
