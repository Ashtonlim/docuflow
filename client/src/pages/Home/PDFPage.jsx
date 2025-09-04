import { useMemo, useState } from 'react'
import { Page } from 'react-pdf'
import SelectionBox from './SelectionBox'

import './Sample.css'

const PDFPage = ({ pageNumber, savedCoords, setsavedCoords }) => {
  const [page, setpage] = useState(null)
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
    const rect = e.target.getBoundingClientRect()
    const domX = e.clientX - rect.left
    const domY = e.clientY - rect.top
    return [domX, domY]
  }

  const handleMouseDown = (e) => {
    const xy = getDOMxy(e)
    setdomEnd(xy)
    setdomStart(xy)
    setIsSelecting(true)
  }

  const handleMouseMove = (e) => {
    if (isSelecting) {
      setdomEnd(getDOMxy(e))
    }
  }

  const handleMouseUp = (e) => {
    setIsSelecting(false)
    if (!(pageNumber in savedCoords)) {
      alert('saved coordinates did not initialise correctly')
      return
    }

    const rect = e.target.getBoundingClientRect()
    const [domX, domY] = getDOMxy(e)

    // get top left point
    // pdf y coordinates start from btm. pdfy = pdfHeight - YRelativeToPDF
    const pdfX = Math.min(domStart[0], domX)
    const startDomY = Math.min(domStart[1], domY)
    const pdfY = rect.height - startDomY

    // w and h = diff between 2 clicked points
    const width = Math.abs(domStart[0] - domX)
    const height = Math.abs(domStart[1] - domY)
    const btmx = pdfX + width
    const btmy = pdfY - height

    // console.log(
    //   `mouse up: clientX = ${e.clientX}, clientY = ${e.clientY}, pdfX = ${pdfX}, pdfY = ${pdfY}, btmx = ${btmx}, btmy = ${btmy}, width = ${width}, height = ${height}`,
    // )

    //  find words inside coordinates
    const words = []
    for (let i = 0; i < page.length; i++) {
      let wx = page[i].transform[4]
      let wy = page[i].transform[5]

      if (wx >= pdfX && wx <= btmx && wy <= pdfY && wy >= btmy) {
        words.push(page[i].str)
      }
    }

    setsavedCoords({
      ...savedCoords,
      [pageNumber]: [
        ...savedCoords[pageNumber],
        {
          id: `${pdfX},${pdfY},${width},${height}`,
          pdfX,
          pdfY,
          domY: startDomY,
          width,
          height,
          words,
        },
      ],
    })
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
