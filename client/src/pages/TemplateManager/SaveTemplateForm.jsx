const SaveTemplateForm = ({
  templateName,
  setTemplateName,
  handleSaveTemplate,
}) => {
  return (
    <>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>Template Name</legend>
        <input
          onChange={(e) => setTemplateName(e.target.value)}
          value={templateName}
          type='text'
          className='input'
          placeholder='Give your template a name'
        />
      </fieldset>

      <button onClick={handleSaveTemplate} className='btn btn-soft mt-3'>
        Save Template
      </button>
    </>
  )
}

export default SaveTemplateForm
