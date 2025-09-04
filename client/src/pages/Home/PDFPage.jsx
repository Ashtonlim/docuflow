import { useState } from 'react'
import { Page } from 'react-pdf'
import SelectionBox from './SelectionBox'

import './Sample.css'

const PDFPage = ({
  pageNumber,
  pageText,
  setPageText,
  savedCoords,
  setsavedCoords,
}) => {
  const [page, setpage] = useState(null)
  const [domStart, setdomStart] = useState([-1, -1])
  const [domEnd, setdomEnd] = useState([-1, -1])
  const [isSelecting, setIsSelecting] = useState(false)

  const handleMouseDown = (e) => {
    const xy = getDOMxy(e)
    setdomEnd(xy)
    setdomStart(xy)
    setIsSelecting(true)
  }

  const handleMouseMove = (e) => {
    if (isSelecting === false) {
      return false
    }
    setdomEnd(getDOMxy(e))
  }

  const getDOMxy = (e) => {
    const rect = e.target.getBoundingClientRect()
    const domX = e.clientX - rect.left
    const domY = e.clientY - rect.top
    return [domX, domY]
  }

  const handleMouseUp = (e) => {
    console.log('savedCoords = ', savedCoords, pageNumber)
    setIsSelecting(false)
    if (!(pageNumber in savedCoords)) {
      alert('saved coordinates did not initialise correctly')
      return
    }

    const rect = e.target.getBoundingClientRect()
    const [domX, domY] = getDOMxy(e)

    // get top left point
    // pdf y coordinates start from btm. pdfy = pdfHeight - YRelativeToPDF
    const topx = Math.min(domStart[0], domX)
    const topy = rect.height - Math.min(domStart[1], domY)

    // w and h = diff between 2 clicked points
    const width = Math.abs(domStart[0] - domX)
    const height = Math.abs(domStart[1] - domY)
    const btmx = topx + width
    const btmy = topy - height

    // console.log(
    //   `mouse up: clientX = ${e.clientX}, clientY = ${e.clientY}, topx = ${topx}, topy = ${topy}, btmx = ${btmx}, btmy = ${btmy}, width = ${width}, height = ${height}`,
    // )

    //  find words inside coordinates
    const words = []
    for (let i = 0; i < page.length; i++) {
      let wx = page[i].transform[4]
      let wy = page[i].transform[5]

      if (wx >= topx && wx <= btmx && wy <= topy && wy >= btmy) {
        words.push(page[i].str)
      }
    }

    console.log(words)
    // setIsSelecting(false)
    setsavedCoords({
      ...savedCoords,
      [pageNumber]: [
        ...savedCoords[pageNumber],
        {
          id: `${topx}${topy}${width}${height}`,
          topx,
          topy,
          width,
          height,
          words,
        },
      ],
    })

    // console.log(savedCoords)
  }

  const onPageLoadSuccess = async (pageElement) => {
    console.log('pg no', pageNumber)
    const pagetext = (await pageElement.getTextContent()).items
    setsavedCoords((prev) => ({ ...prev, [pageNumber]: [] }))
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
          zIndex: 100,
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
        {savedCoords[pageNumber]?.map((coords) => (
          <SelectionBox key={coords.id} coords={coords} />
        ))}
        {isSelecting && (
          //   <SelectionBox
          //     coords={{
          //       topx: Math.min(domStart[0], domEnd[0]),
          //       topY: Math.min(domStart[1], domEnd[1]),
          //       width: Math.abs(domStart[0] - domEnd[0]),
          //       height: Math.abs(domStart[1] - domEnd[1]),
          //     }}
          //   />

          <div
            style={{
              position: 'absolute',
              border: '2px dashed #3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              pointerEvents: 'none',
              left: Math.min(domStart[0], domEnd[0]),
              top: Math.min(domStart[1], domEnd[1]),
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
