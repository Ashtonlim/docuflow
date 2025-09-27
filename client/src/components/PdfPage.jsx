import { useDispatch } from 'react-redux'
import { addBoundingBox } from '@/features/pdf/pdfSlice'
// import { getWordsInAreaFromPage, calcCoordinates } from '@/utils/pdfUtils'

import { addPage } from '@/features/pdf/pdfSlice'
import { Page } from 'react-pdf'

const PDFPage = ({ page_number }) => {
  const dispatch = useDispatch()
  const onPageLoadSuccess = async (pageElement) => {
    const width = pageElement.width
    const height = pageElement.height
    pageElement.getAnnotations().then((annots) => {
      annots.forEach((a) => {
        if (a.subtype !== 'Widget') {
          return
          // console.log(a.fieldName, a.rect)
        }
        // console.log(a)
        const [left, btm, right, top] = a.rect
        // console.log(left, btm, right, top, a)

        const coord = {
          domY: (height - top) / height,
          pdfX: left / width,
          pdfY: top / height,
          width: (right - left) / width,
          height: (top - btm) / height,
          label_name: 'label name',
          page_number,
        }
        coord.id = `${coord.pdfX},${coord.pdfY},${coord.width},${coord.height}`

        // coord.selectedWords = getWordsInAreaFromPage(
        //   coord,
        //   pdf.pages[page_number],
        // )
        // dispatch(addText({ page_number, text }))

        // console.log(coord)
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
