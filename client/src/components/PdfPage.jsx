import { addPage, setBoundingBox } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'

import { Page } from 'react-pdf'
import { normalisePoints } from '@/utils/pdfUtils'

const PdfPage = ({ pdf_id, page_number }) => {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()

  const onPageLoadSuccess = async (pageElement) => {
    const { width, height } = pageElement

    const words = (await pageElement.getTextContent()).items
    dispatch(
      addPage({
        pdf_id,
        page_number,
        page: { width, height, words },
      }),
    )

    // Extract all form fields
    const annotations = await pageElement.getAnnotations()

    const boxes = []
    for (let i = 0; i < annotations.length; i++) {
      let annot = annotations[i]
      if (annot.subtype !== 'Widget') {
        continue
      }

      const coord = normalisePoints(annot.rect, width, height)
      coord.page_number = page_number
      coord.label = `${page_number}_${annot.fieldName}`
      coord.selectedWords = annot.fieldName
      boxes.push(coord)
    }
    dispatch(setBoundingBox({ pdf_id, boxes }))
  }

  return <Page pageNumber={page_number} onLoadSuccess={onPageLoadSuccess} />
}

export default PdfPage

// annotations.forEach((annot) => {
//   if (annot.subtype !== 'Widget') {
//     return
//   }

//   const coord = normalisePoints(annot.rect, { width, height })

//   coord.page_number = page_number
//   coord.label = `${page_number}_${annot.fieldName}`
//   coord.selectedWords = annot.fieldName

//   dispatch(addBoundingBox({ pdf_id, coord }))
// })
