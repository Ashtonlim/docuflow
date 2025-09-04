import { useMemo, useState } from 'react'
import { Page } from 'react-pdf'
import SelectionBox from './SelectionBox'

import './Sample.css'

const PDFPage = ({ pageNumber, savedCoords, setsavedCoords }) => {
  const [page, setpage] = useState([])
  const [domStart, setdomStart] = useState([-1, -1])
  const [domEnd, setdomEnd] = useState([-1, -1])
  const [isSelecting, setIsSelecting] = useState(false)

  console.log(`page ${pageNumber} is running`)

  const handleDelete = (id) => {
    setsavedCoords((prev) => ({
      ...prev,
      [pageNumber]: prev[pageNumber].filter((c) => c.id !== id),
    }))
  }

  // ✅ Memoize coordinate rendering
  const renderedCoords = useMemo(
    () =>
      savedCoords[pageNumber]?.map((coords) => (
        <SelectionBox
          key={coords.id}
          coords={coords}
          handleDelete={handleDelete}
        />
      )),
    [savedCoords[pageNumber], pageNumber],
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
    if (!isSelecting) return
    setIsSelecting(false)
    if (!(pageNumber in savedCoords)) {
      console.error('saved coordinates did not initialise correctly.')
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const [domX, domY] = getDOMxy(e)
    const startDomY = Math.min(domStart[1], domY)

    // get top left point
    // pdf y coordinates start from btm. pdfy = pdfHeight - YRelativeToPDF
    const coord = {
      pdfX: Math.min(domStart[0], domX),
      pdfY: rect.height - startDomY,
      domY: startDomY,
      width: Math.abs(domStart[0] - domX),
      height: Math.abs(domStart[1] - domY),
      words: [],
    }

    // w and h = diff between 2 clicked points
    const btmx = coord.pdfX + coord.width
    const btmy = coord.pdfY - coord.height

    // console.log(
    //   `mouse up: clientX = ${e.clientX}, clientY = ${e.clientY}, coords = ${coord}`,
    // )

    //  find words inside coordinates
    for (let i = 0; i < page.length; i++) {
      let wx = page[i].transform[4]
      let wy = page[i].transform[5]

      if (wx >= coord.pdfX && wx <= btmx && wy <= coord.pdfY && wy >= btmy) {
        coord.words.push(page[i].str)
      }
    }

    coord.id = `${coord.pdfX},${coord.pdfY},${coord.width},${coord.height}`

    setsavedCoords((prev) => ({
      ...prev,
      [pageNumber]: [...prev[pageNumber], coord],
    }))
  }

  const onPageLoadSuccess = async (pageElement) => {
    const pagetext = (await pageElement.getTextContent()).items
    setpage(pagetext)
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        marginTop: 10,
      }}
    >
      <Page pageNumber={pageNumber} onLoadSuccess={onPageLoadSuccess} />
      <div
        className='overlay'
        style={{
          position: 'absolute',
          zIndex: 10,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {renderedCoords}

        {isSelecting && (
          <SelectionBox
            coords={{
              pdfX: Math.min(domStart[0], domEnd[0]),
              domY: Math.min(domStart[1], domEnd[1]),
              width: Math.abs(domStart[0] - domEnd[0]),
              height: Math.abs(domStart[1] - domEnd[1]),
            }}
          />
        )}
      </div>
    </div>
  )
}

export default PDFPage
