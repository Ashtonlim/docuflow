import { addBoundingBox } from '@/features/pdf/pdfSlice'
import { useMemo, useState } from 'react'
import { Page } from 'react-pdf'
import { useDispatch, useSelector } from 'react-redux'
import SelectionBox from './SelectionBox'

const PDFPage = ({ pageNumber }) => {
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
        ?.filter((c) => c.pageNumber === pageNumber)
        ?.map((coords) => <SelectionBox key={coords.id} coords={coords} />),
    [pdf.bounding_boxes, pageNumber],
  )

  const getDOMxy = (e) => {
    // use currentTarget: is the element that the event listener is attached to.
    // instead of target bc: is the element that triggered the event (e.g., the user clicked on)

    const rect = e.currentTarget.getBoundingClientRect()
    const domX = e.clientX - rect.left
    const domY = e.clientY - rect.top
    return [domX, domY]
  }

  const handleMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      const xy = getDOMxy(e)
      setdomEnd(xy)
      setdomStart(xy)
      setIsSelecting(true)
    }
  }

  const handleMouseMove = (e) => {
    if (isSelecting) {
      setdomEnd(getDOMxy(e))
      return
    }
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
      pageNumber,
      pageWidth: page.width,
      pageHeight: page.height,
      label: 'label name',
      words: [],
    }

    // w and h = diff between 2 clicked points
    const btmx = coord.pdfX + coord.width
    const btmy = coord.pdfY - coord.height

    // console.log(
    //   `mouse up: clientX = ${e.clientX}, clientY = ${e.clientY}, coords = ${coord}`,
    // )

    const text = page.pagetext
    //  find words inside coordinates
    for (let i = 0; i < text.length; i++) {
      let wx = text[i].transform[4] / page.width
      let wy = text[i].transform[5] / page.height

      if (wx >= coord.pdfX && wx <= btmx && wy <= coord.pdfY && wy >= btmy) {
        coord.words.push(text[i].str == '' ? ' ' : text[i].str)
      }
    }

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
      <Page pageNumber={pageNumber} onLoadSuccess={onPageLoadSuccess} />
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
