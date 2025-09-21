import { addBoundingBox, addPage, addText } from '@/features/pdf/pdfSlice'
import { useMemo, useState } from 'react'
import { Page } from 'react-pdf'
import { useDispatch, useSelector } from 'react-redux'
import SelectionBox from './SelectionBox'

const getWordsInAreaFromPage = (area, pageData) => {
  // pdfX,Y should always be top left of area in PDF coordinates (y inversed)
  // btmx and btmy are bottom right of area
  const { pdfX: startX, pdfY: startY, btmx: endX, btmy: endY } = area
  const { words, width, height } = pageData

  return words
    ?.filter((word) => {
      let pdfBtmLeftX = word.transform[4] / width
      let pdfBtmLeftY = word.transform[5] / height

      // word starting pos inside area
      let xInArea = startX <= pdfBtmLeftX && pdfBtmLeftX <= endX

      // opposite directions as pdf reads yAxis from bottom to left. i.e. Bottom = 0px, top = heightOfPdf
      let yInArea = startY >= pdfBtmLeftY && pdfBtmLeftY >= endY

      return xInArea && yInArea
    })
    ?.map((word) => (word.str == '' ? ' ' : word.str))
}

const PDFPage = ({ page_number }) => {
  const dispatch = useDispatch()
  const pdf = useSelector((state) => state.pdf)

  const [domStart, setdomStart] = useState([-1, -1])
  const [domEnd, setdomEnd] = useState([-1, -1])
  const [isSelecting, setIsSelecting] = useState(false)

  // ✅ Memoize coordinate rendering
  const renderedCoords = useMemo(
    () =>
      pdf.bounding_boxes
        ?.filter((c) => c.page_number === page_number)
        ?.map((coords) => (
          <SelectionBox
            key={coords.id}
            page={{
              width: pdf.pages[page_number].width,
              height: pdf.pages[page_number].height,
            }}
            coords={coords}
          />
        )),
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
    return isSelecting ? setdomEnd(getDOMxy(e)) : null
  }

  // get top left point
  // pdf y coordinates start from btm. pdfy = pdfHeight - YRelativeToPDF
  const calcCoordinates = (domStart, domEnd, pageData) => {
    const { width, height } = pageData
    const [firstClickX, firstClickY] = domStart
    const [lastClickX, lastClickY] = domEnd
    const topLeftX = Math.min(firstClickX, lastClickX)
    const topLeftY = Math.min(firstClickY, lastClickY)

    // to convert domy into pdfy -> pdfHeight - domy (topLeftY)
    // right at btm of page, if pdfHeight = 500, then domy = 500
    // therefore pdfy = 500 - 500 = 0px
    return {
      domY: topLeftY / height,
      pdfX: topLeftX / width,
      pdfY: (height - topLeftY) / height,
      width: Math.abs(firstClickX - lastClickX) / width,
      height: Math.abs(firstClickY - lastClickY) / height,
      label_name: 'label name',
    }
  }

  const handleMouseUp = (e) => {
    // prevent all mouseups from running
    if (isSelecting === false) {
      return
    }

    setIsSelecting(false)

    const ele = e.currentTarget.getBoundingClientRect()
    console.info(
      'Compare page vs e.currentTarget height',
      pdf.height,
      ele.height,
    )

    const coord = calcCoordinates(domStart, getDOMxy(e), pdf.pages[page_number])
    coord.page_number = page_number
    // w and h = diff between 2 clicked points
    coord.btmx = coord.pdfX + coord.width
    coord.btmy = coord.pdfY - coord.height

    const text = getWordsInAreaFromPage(coord, pdf.pages[page_number])
    coord.selectedWords = text.join('')
    console.info('these are the text', text, coord.selectedWords)

    coord.id = `${coord.pdfX},${coord.pdfY},${coord.width},${coord.height}`

    // dispatch(addText({ page_number, text }))
    dispatch(addBoundingBox(coord))
  }

  const onPageLoadSuccess = async (pageElement) => {
    const words = (await pageElement.getTextContent()).items
    // setPage()
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
            page={{
              width: pdf.pages[page_number].width,
              height: pdf.pages[page_number].height,
            }}
            coords={calcCoordinates(domStart, domEnd, pdf.pages[page_number])}
          />
        )}
      </div>
    </div>
  )
}

export default PDFPage
