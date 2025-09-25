import LayoutOne from '../../components/LayoutOne'

function About() {
  return (
    <LayoutOne>
      <h1>About</h1>
      <div>
        This app is to automate extracting text from PDFs and inserting them
        into target PDFs.
      </div>

      <div className='mt-3'>
        In verson 1 of docuflow, target pdfs need form controls (are able to
        edit fields in your pdf) to tell the selections you have chosen where it
        should insert into in the target PDF.
      </div>
    </LayoutOne>
  )
}

export default About
