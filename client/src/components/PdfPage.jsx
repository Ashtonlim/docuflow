import { addBoundingBox } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'
// import { getWordsInAreaFromPage, calcCoordinates } from '@/utils/pdfUtils'

import { addPage } from '@/features/pdf/pdfSlice'
import { Page } from 'react-pdf'
import { getWordsInAreaFromPage, calcCoordinates } from '@/utils/pdfUtils'

const PDFPage = ({ page_number }) => {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const onPageLoadSuccess = async (pageElement) => {
    const width = pageElement.width
    const height = pageElement.height

    // PDF properties
    pageElement.getAnnotations().then((annots) => {
      annots.forEach((a) => {
        if (a.subtype !== 'Widget') {
          return
          // console.log(a.fieldName, a.rect)
        }
        console.log(a.fieldName)
        // const [left, btm, right, top] = a.rect
        // console.log(left, btm, right, top, a)

        const coord = calcCoordinates(a.rect, { width, height })
        console.log('calcCoordinates', calcCoordinates)

        coord.page_number = page_number
        coord.label = `${page_number}_${a.fieldName}`
        coord.selectedWords = a.fieldName

        dispatch(addBoundingBox(coord))
      })
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

export default PDFPage
