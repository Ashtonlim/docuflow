import { addPage, setBoundingBox } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createBoundingBoxObject } from '@/utils/pdfUtils'
import { Page } from 'react-pdf'

const PdfPage = ({ pdf_id, page_number }) => {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()

  const onPageLoadSuccess = async (pageElement) => {
    const { width, height } = pageElement

    const words = (await pageElement.getTextContent()).items
    const page = { width, height, words }
    dispatch(addPage({ pdf_id, page_number, page }))

    // Extract all form fields
    const annotations = await pageElement.getAnnotations()

    const boxes = []
    for (let i = 0; i < annotations.length; i++) {
      let annot = annotations[i]
      if (annot.subtype !== 'Widget') {
        continue
      }

      const coord = createBoundingBoxObject({
        area: annot.rect,
        page,
        page_number,
        words: annot.fieldName,
      })

      boxes.push(coord)
    }
    dispatch(setBoundingBox({ pdf_id, boxes }))
  }

  return <Page pageNumber={page_number} onLoadSuccess={onPageLoadSuccess} />
}

export default PdfPage
