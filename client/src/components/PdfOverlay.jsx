import { addBoundingBox } from '@/features/pdf/pdfSlice'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SelectionBox from '@/components/SelectionBox'

import { getWordsInAreaFromPage, normalisePoints } from '@/utils/pdfUtils'

const PdfOverlay = ({ page_number, bounding_boxes, editable }) => {
  const dispatch = useDispatch()
  const pdf = useSelector((state) => state.pdf)

  // left, bottom, right, top
  const [area, setArea] = useState([0, 0, 0, 0])
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
    const x = e.clientX - rect.left
    const y = pdf.pages[page_number].height - (e.clientY - rect.top)
    return [x, y]
  }

  const handleMouseDown = (e) => {
    // e.target vs e.currentTarget
    // e.target: is element that ORIGINALLY triggered the even. COULD be parent or nested element
    // e.currentTarget: is element that the event listener is attached to

    // only want even to trigger when clicking on base element, not on some overlay or sibling element that's currently over target
    if (e.target === e.currentTarget) {
      const [x, y] = getDOMxy(e)
      setArea(() => [x, y, x, y])
      setIsSelecting(true)
    }
  }

  const handleMouseMove = (e) => {
    // const { bottom, right } = e.currentTarget.getBoundingClientRect()
    // don't run if mouseDown wasn't valid
    if (isSelecting) {
      const [x, y] = getDOMxy(e)
      setArea(() => [area[0], y, x, area[3]])
    }
  }

  const handleMouseUp = (e) => {
    // prevent all mouseups from running
    if (isSelecting === false) {
      return
    }

    setIsSelecting(false)
    // const ele = e.currentTarget.getBoundingClientRect()
    // console.info(
    //   'Compare page vs e.currentTarget height',
    //   pdf.height,
    //   ele.height,
    // )

    const coord = normalisePoints(area, pdf.pages[page_number])
    coord.page_number = page_number
    coord.label = `${page_number}_`

    coord.selectedWords = getWordsInAreaFromPage(coord, pdf.pages[page_number])
    coord.id = `${coord.left},${coord.bottom},${coord.right},${coord.top}`
    console.log('normalisePoints pdfOverlay', coord)

    setArea(() => [0, 0, 0, 0])

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
          canDelete={editable}
          page={{
            width: pdf.pages[page_number].width,
            height: pdf.pages[page_number].height,
          }}
          coords={normalisePoints(area, pdf.pages[page_number])}
        />
      )}
    </div>
  )
}

export default PdfOverlay
