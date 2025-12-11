import PdfPage from '@/components/PdfPage'
import PdfOverlay from '@/components/PdfOverlay'
import { Document } from 'react-pdf'
import { options } from '@/utils/constants'
import { useState, useEffect } from 'react'
import {
  useGetTemplateQuery,
  useGetPDFQuery,
} from '@/features/template/templateSlice'

import SelectedWordsList from '@/components/SelectedWordsList'
import Spinner from '@/components/Spinner'
import { reInitFile } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'

// REVIEW: Might not be a good solution but works
// temporary PDFs are stored as 0 in redux state
const temp = 0

const PdfDoc = ({
  pdf_id = temp,
  template_id = temp,
  pdfURL = null,
  editable = false,
  showSelectedWords = false,
}) => {
  const [pageCount, setPageCount] = useState(0)
  const dispatch = useDispatch()
  const [fileURL, setFileURL] = useState('')

  const {
    data: template,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
  } = useGetTemplateQuery(template_id, { skip: template_id === temp })

  const {
    data: pdfSourceData,
    isLoading: isPDFLoading,
    isError: isPDFError,
  } = useGetPDFQuery(pdf_id, { skip: pdf_id === temp })

  useEffect(() => {
    if (template) {
      dispatch(reInitFile({ pdf_id, data: template }))
    }

    if (pdfSourceData) {
      setFileURL(pdfSourceData.url)
      return () => URL.revokeObjectURL(pdfSourceData.url) // prevents memory leak
    }

    if (pdfURL) {
      setFileURL(pdfURL)
    }
  }, [pdfSourceData, pdfURL])

  const onLoadSuccess = ({ numPages }) => {
    setPageCount(numPages)
  }

  const onLoadError = (error) => {
    console.error(`Error to load PDF: ${error.message}`)
  }

  if (isPDFLoading || isTemplateLoading) {
    return <Spinner />
  }

  return (
    <div>
      {template && (
        <div>{`Number of fields: ${template.bounding_boxes.length}`}</div>
      )}

      <Document
        key={fileURL}
        file={fileURL}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        options={options}
      >
        {pageCount > 0 ? (
          [...Array(pageCount).keys()].map((pageNumber) => (
            <div key={`pg_${pageNumber + 1}`} className='flex flex-row'>
              <div className='relative mb-3 inline-block'>
                <PdfPage pdf_id={pdf_id} page_number={pageNumber + 1} />
                <PdfOverlay
                  pdf_id={pdf_id}
                  page_number={pageNumber + 1}
                  editable={editable}
                  bounding_boxes={template?.bounding_boxes || []}
                />
              </div>
              {showSelectedWords && (
                <SelectedWordsList
                  pdf_id={pdf_id}
                  page_number={pageNumber + 1}
                />
              )}
            </div>
          ))
        ) : (
          <div>0 pages found in PDF</div>
        )}
      </Document>
    </div>
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
