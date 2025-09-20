import { useMemo, useState } from 'react'
import { Page } from 'react-pdf'
import { useSelector } from 'react-redux'
import SelectionBox from './SelectionBox'

const PDFPage = ({ page_number }) => {
  const pdf = useSelector((state) => state.pdf)

  const [page, setPage] = useState([])

  // ✅ Memoize coordinate rendering
  const renderedCoords = useMemo(
    () =>
      pdf.bounding_boxes
        ?.filter((c) => c.page_number === page_number)
        ?.map((coords) => (
          <SelectionBox key={coords.id} page={page} coords={coords} />
        )),
    [page, pdf.bounding_boxes, page_number],
  )

  const onPageLoadSuccess = async (pageElement) => {
    // const pagetext = (await pageElement.getTextContent()).items
    let pagetext = null
    try {
      pagetext = (await pageElement.getTextContent()).items
    } catch (error) {
      console.log('what is erro', error)
    }

    setPage({ width: pageElement.width, height: pageElement.height, pagetext })
  }

  return (
    <div className='relative mt-3 inline-block'>
      <Page pageNumber={page_number} onLoadSuccess={onPageLoadSuccess} />
      <div className='overlay absolute top-0 left-0 z-10 h-full w-full'>
        {renderedCoords}
      </div>
    </div>
  )
}

export default PDFPage
