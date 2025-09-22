import { addBoundingBox } from '@/features/pdf/pdfSlice'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SelectionBox from '@/components/SelectionBox'

import { getWordsInAreaFromPage, calcCoordinates } from '@/utils/pdfUtils'

const PdfOverlay = ({ page_number, editable = true }) => {
  const dispatch = useDispatch()
  const pdf = useSelector((state) => state.pdf)

  const [domStart, setdomStart] = useState([-1, -1])
  const [domEnd, setdomEnd] = useState([-1, -1])
  const [isSelecting, setIsSelecting] = useState(false)

  // ✅ Memoize coordinate rendering
  const renderedCoords = useMemo(
    () =>
      pdf.pages[page_number]
        ? pdf.bounding_boxes
            ?.filter((box) => box.page_number === page_number)
            ?.map((coords) => (
              <SelectionBox
                canDelete={editable}
                key={coords.id}
                page={{
                  width: pdf.pages[page_number].width,
                  height: pdf.pages[page_number].height,
                }}
                coords={coords}
              />
            ))
        : [],
    [pdf.bounding_boxes, pdf.pages[page_number]],
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

    coord.selectedWords = getWordsInAreaFromPage(coord, pdf.pages[page_number])
    coord.id = `${coord.pdfX},${coord.pdfY},${coord.width},${coord.height}`

    // dispatch(addText({ page_number, text }))
    dispatch(addBoundingBox(coord))
  }

  const doNothing = () => {}

  /* page overlay to allow box selection */
  return (
    <div
      className={`overlay absolute top-0 left-0 z-10 h-full w-full ${editable && 'cursor-crosshair'}`}
      onMouseDown={editable ? handleMouseDown : doNothing}
      onMouseMove={editable ? handleMouseMove : doNothing}
      onMouseUp={editable ? handleMouseUp : doNothing}
    >
      {renderedCoords}

      {editable && isSelecting && (
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
  )
}

export default PdfOverlay
