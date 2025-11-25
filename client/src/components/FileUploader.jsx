const FileUploader = ({ onFileChange, label }) => {
  return (
    <div className='my-4 flex flex-col'>
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
