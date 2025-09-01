// import { useEffect, useRef, useState } from 'react'
// import LayoutOne from '../components/LayoutOne'

// import { Document, Page, pdfjs } from 'react-pdf'
// import 'react-pdf/dist/Page/TextLayer.css'
// import 'react-pdf/dist/Page/AnnotationLayer.css'

// function Home() {
//   const [file, setFile] = useState(null)
//   const [numPages, setNumPages] = useState(null)
//   const [selectedText, setSelectedText] = useState('')
//   const textLayerRef = useRef(null)

//   // useEffect(() => {}, [])
//   function onFileChange(e) {
//     if (e.target.files) {
//       setFile(e.target.files[0])
//     }
//   }

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages)
//   }

//   function handleMouseUp() {
//     const selection = window.getSelection()
//     if (selection && selection.toString().trim() !== '') {
//       setSelectedText(selection.toString())
//     }
//   }

//   return (
//     <LayoutOne>
//       <div className='ruCol mb-5'>
//         <h1 className='hoverable-text mb-3'>Upload your PDF</h1>
//       </div>

//       <div>
//         <input type='file' onChange={onFileChange} />
//         {file && (
//           <div>
//             <div>File Name: {file.name}</div>
//             <div>File Type: {file.type}</div>
//           </div>
//         )}
//       </div>
//     </LayoutOne>
//   )
// }

// export default Home
