import PdfPage from '@/components/PdfPage'
import PdfOverlay from '@/components/PdfOverlay'
import { Document } from 'react-pdf'
import { options } from '@/utils/constants'
import { useState } from 'react'

import SelectedWordsList from '@/components/SelectedWordsList'

const PdfDoc = ({
  fileURL,
  bounding_boxes,
  editable = false,
  showSelectedWords = false,
}) => {
  const [pageCount, setPageCount] = useState(null)

  const onLoadSuccess = ({ numPages }) => {
    setPageCount(numPages)
  }

  const onLoadError = (error) => {
    console.error(`Error to load PDF: ${error.message}`)
  }

  return (
    <Document
      key={fileURL}
      file={fileURL}
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
      options={options}
    >
      {pageCount ? (
        [...Array(pageCount).keys()].map((pageNumber) => (
          <div key={`pg_${pageNumber + 1}`} className='flex flex-row'>
            <div className='relative mb-3 inline-block'>
              <PdfPage page_number={pageNumber + 1} />
              <PdfOverlay
                page_number={pageNumber + 1}
                editable={editable}
                bounding_boxes={bounding_boxes}
              />
            </div>
            {showSelectedWords && (
              <SelectedWordsList page_number={pageNumber + 1} />
            )}
          </div>
        ))
      ) : (
        <div>0 pages found in PDF</div>
      )}
    </Document>
  )
}

export default PdfDoc

//   <div className='pdfviewer'>
//     <div className='pdfviewer__container'>
//       {targetFile && (
//         <div className='pdfviewer__container__document'>
//           <Document
//             key={targetFile}
//             file={targetFile}
//             onLoadSuccess={onTargetLoadSuccess}
//             options={options}
//           >
//             {targetPages
//               ? [...Array(targetPages).keys()].map((pageNumber) => (
//                   <div
//                     key={`pg_${pageNumber + 1}`}
//                     className='flex flex-row'
//                   >
//                     <div className='relative mt-3 inline-block'>
//                       <PdfPage page_number={pageNumber + 1} />
//                       <PdfOverlay
//                         page_number={pageNumber + 1}
//                         editable={false}
//                       />
//                     </div>
//                     <SelectedWordsList page_number={pageNumber + 1} />
//                   </div>
//                 ))
//               : 0}
//           </Document>
//         </div>
//       )}
//     </div>
//   </div>
