import { addBoundingBox } from '@/features/pdf/pdfSlice'
import { useMemo, useState } from 'react'
import { Page } from 'react-pdf'
import { useDispatch, useSelector } from 'react-redux'
import SelectionBox from './SelectionBox'

const getWordsInAreaFromPage = (area, pageData) => {
  // pdfX,Y should always be top left of area in PDF coordinates (y inversed)
  // btmx and btmy are bottom right of area
  const { pdfX: startX, pdfY: startY, btmx: endX, btmy: endY } = area
  const { pagetext, width, height } = pageData

  return pagetext
    .filter((word) => {
      let pdfBtmLeftX = word.transform[4] / width
      let pdfBtmLeftY = word.transform[5] / height

      // word starting pos inside area
      let xInArea = startX <= pdfBtmLeftX && pdfBtmLeftX <= endX

      // opposite directions as pdf reads yAxis from bottom to left. i.e. Bottom = 0px, top = heightOfPdf
      let yInArea = startY >= pdfBtmLeftY && pdfBtmLeftY >= endY

      return xInArea && yInArea
    })
    .map((word) => (word.str == '' ? ' ' : word.str))
}

const PDFPage = ({ page_number }) => {
  const dispatch = useDispatch()
  const pdf = useSelector((state) => state.pdf)

  const [page, setPage] = useState([])
  const [domStart, setdomStart] = useState([-1, -1])
  const [domEnd, setdomEnd] = useState([-1, -1])
  const [isSelecting, setIsSelecting] = useState(false)

  // ✅ Memoize coordinate rendering
  const renderedCoords = useMemo(
    () =>
      pdf.bounding_boxes
        ?.filter((c) => c.page_number === page_number)
        ?.map((coords) => <SelectionBox key={coords.id} coords={coords} />),
    [pdf.bounding_boxes, page_number],
  )

  const getDOMxy = (e) => {
    // domX and Y should be relative to the boundary of the overlay
    // react.left and top is top left point of the overlay relative to entire html
    // clientX and Y are points relative to entire html

    const rect = e.currentTarget.getBoundingClientRect()
    const domX = e.clientX - rect.left
    const domY = e.clientY - rect.top
    return [domX, domY]
  }

  const handleMouseDown = (e) => {
    // e.target vs e.currentTarget
    // e.target: is element that ORIGINALLY triggered the even. COULD be parent or nested element
    // e.currentTarget: is element that the event listener is attached to

    // only want even to trigger when clicking on base element, not on some overlay or sibling element that's currently over target
    if (e.target === e.currentTarget) {
      const xy = getDOMxy(e)
      setdomEnd(xy)
      setdomStart(xy)
      setIsSelecting(true)
    }
  }

  const handleMouseMove = (e) => {
    // don't run if mouseDown wasn't valid
    return isSelecting ? setdomEnd(getDOMxy) : null
  }

  const handleMouseUp = (e) => {
    // prevent all mouseups from running
    if (isSelecting === false) {
      return
    }

    setIsSelecting(false)

    const rect = e.currentTarget.getBoundingClientRect()
    const [domX, domY] = getDOMxy(e)
    const startDomY = Math.min(domStart[1], domY)

    // get top left point
    // pdf y coordinates start from btm. pdfy = pdfHeight - YRelativeToPDF
    const coord = {
      pdfX: Math.min(domStart[0], domX) / page.width,
      pdfY: (rect.height - startDomY) / page.height,
      domY: startDomY / page.height,
      width: Math.abs(domStart[0] - domX) / page.width,
      height: Math.abs(domStart[1] - domY) / page.height,
      page_number,
      pageWidth: page.width,
      pageHeight: page.height,
      label_name: 'label name',
      words: [],
    }
    // w and h = diff between 2 clicked points
    coord.btmx = coord.pdfX + coord.width
    coord.btmy = coord.pdfY - coord.height

    coord.words = getWordsInAreaFromPage(coord, page)
    coord.id = `${coord.pdfX},${coord.pdfY},${coord.width},${coord.height}`
    coord.wordAsStr = coord.words.join('')

    dispatch(addBoundingBox(coord))
  }

  const onPageLoadSuccess = async (pageElement) => {
    const pagetext = (await pageElement.getTextContent()).items
    setPage({ width: pageElement.width, height: pageElement.height, pagetext })
  }

  return (
    <div className='relative mt-3 inline-block'>
      <Page pageNumber={page_number} onLoadSuccess={onPageLoadSuccess} />
      <div
        className='overlay absolute top-0 left-0 z-10 h-full w-full cursor-crosshair'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {renderedCoords}

        {isSelecting && (
          <SelectionBox
            canDelete={false}
            coords={{
              pdfX: Math.min(domStart[0], domEnd[0]) / page.width,
              domY: Math.min(domStart[1], domEnd[1]) / page.height,
              width: Math.abs(domStart[0] - domEnd[0]) / page.width,
              height: Math.abs(domStart[1] - domEnd[1]) / page.height,
              pageWidth: page.width,
              pageHeight: page.height,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default PDFPage

// style={{
//   position: 'relative',
//   display: 'inline-block',
//   marginTop: 10,
// }}
//     style={{
//     position: 'absolute',
//     zIndex: 10,
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     cursor: 'crosshair',
//   }}
