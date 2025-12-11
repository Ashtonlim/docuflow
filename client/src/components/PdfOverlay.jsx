import { addBoundingBox } from '@/features/pdf/pdfSlice'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SelectionBox from '@/components/SelectionBox'

import { getWordsInAreaFromPage, normalisePoints } from '@/utils/pdfUtils'

const PdfOverlay = ({ pdf_id, page_number, editable }) => {
  const dispatch = useDispatch()
  const pdf = useSelector((state) => state.pdf)

  // left, bottom, right, top
  const [area, setArea] = useState([0, 0, 0, 0])
  const [isSelecting, setIsSelecting] = useState(false)

  // ✅ Memoize coordinate rendering
  const renderedCoords = useMemo(
    () =>
      pdf[pdf_id].pages[page_number]
        ? pdf[pdf_id].bounding_boxes
            ?.filter((box) => box.page_number === page_number)
            ?.map((coords, i) => (
              <SelectionBox
                key={i}
                coords={coords}
                pdf_id={pdf_id}
                page_number={page_number}
                page={{
                  width: pdf[pdf_id].pages[page_number].width,
                  height: pdf[pdf_id].pages[page_number].height,
                }}
                canDelete={editable}
              />
            ))
        : [],
    [pdf[pdf_id].bounding_boxes, pdf[pdf_id].pages],
  )

  const getDOMxy = (e) => {
    // domX and Y should be relative to the boundary of the overlay
    // react.left and top is top left point of the overlay relative to entire html
    // clientX and Y are points relative to entire html

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = pdf[pdf_id].pages[page_number].height - (e.clientY - rect.top)
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
    //   pdf[pdf_id].height,
    //   ele.height,
    // )

    const coord = normalisePoints(area, pdf[pdf_id].pages[page_number])
    coord.page_number = page_number
    coord.label = `${page_number}_`

    coord.selectedWords = getWordsInAreaFromPage(
      coord,
      pdf[pdf_id].pages[page_number],
    )
    coord.id = `${coord.left},${coord.bottom},${coord.right},${coord.top}`

    setArea(() => [0, 0, 0, 0])

    // dispatch(addBoundingBox(coord))
    dispatch(addBoundingBox({ pdf_id, coord }))
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
            width: pdf[pdf_id].pages[page_number].width,
            height: pdf[pdf_id].pages[page_number].height,
          }}
          coords={normalisePoints(area, pdf[pdf_id].pages[page_number])}
        />
      )}
    </div>
  )
}

export default PdfOverlay
