import { useDispatch } from 'react-redux'

import { addPage } from '@/features/pdf/pdfSlice'
import { Page } from 'react-pdf'

const PDFPage = ({ page_number }) => {
  const dispatch = useDispatch()
  const onPageLoadSuccess = async (pageElement) => {
    const words = (await pageElement.getTextContent()).items
    dispatch(
      addPage({
        page_number,
        page: {
          width: pageElement.width,
          height: pageElement.height,
          words,
        },
      }),
    )
  }

  return <Page pageNumber={page_number} onLoadSuccess={onPageLoadSuccess} />
}

export default PDFPage
