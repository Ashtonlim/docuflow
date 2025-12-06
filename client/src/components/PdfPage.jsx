import { addBoundingBox } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'

import { addPage } from '@/features/pdf/pdfSlice'
import { Page } from 'react-pdf'
import { normalisePoints } from '@/utils/pdfUtils'

const PdfPage = ({ page_number }) => {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()

  const onPageLoadSuccess = async (pageElement) => {
    const width = pageElement.width
    const height = pageElement.height

    // Extract all form fields
    const annotations = await pageElement.getAnnotations()

    annotations.forEach((annot) => {
      if (annot.subtype !== 'Widget') {
        return
      }

      const coord = normalisePoints(annot.rect, { width, height })

      coord.page_number = page_number
      coord.label = `${page_number}_${annot.fieldName}`
      coord.selectedWords = annot.fieldName

      dispatch(addBoundingBox(coord))
    })

    const words = (await pageElement.getTextContent()).items
    dispatch(
      addPage({
        page_number,
        page: { width, height, words },
      }),
    )
  }

  return <Page pageNumber={page_number} onLoadSuccess={onPageLoadSuccess} />
}

export default PdfPage
