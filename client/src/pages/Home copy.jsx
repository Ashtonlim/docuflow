import { useId, useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import './Sample.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  wasmUrl: '/wasm/',
}

export default function Home() {
  const fileId = useId()
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState()
  const [pageText, setPageText] = useState({})
  const [dragStart, setDragStart] = useState([-1, -1])

  const onFileChange = (event) => {
    const nextFile = event.target?.files?.[0]
    if (nextFile) {
      setFile(nextFile)
    }
  }

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages)
  }

  const handleMouseDown = (e) => {
    const rect = e.target.getClientRects()[0]
    const x = e.clientX - rect.left
    const y = rect.height - (e.clientY - rect.top)
    setDragStart([x, y])
  }

  const handleMouseUp = (e, pgNumber) => {
    const rect = e.target.getClientRects()[0]

    const x = e.clientX - rect.left
    const y = rect.height - (e.clientY - rect.top)

    if (!(pgNumber in pageText)) {
      alert('page was not loaded into pageText')
      return
    }

    const pg = pageText[pgNumber]
    const width = Math.abs(dragStart[0] - x)
    const height = Math.abs(dragStart[1] - y)
    const topx = Math.min(dragStart[0], x)
    const topy = Math.max(dragStart[1], y)
    const btmx = topx + width
    const btmy = topy - height
    // console.log(
    //   // pg,
    //   `mouse up: clientX = ${e.clientX}, clientY = ${e.clientY}, topx = ${topx}, topy = ${topy}, width = ${width}, height = ${height}`,
    // )

    //  find words inside coordinates
    const words = []
    for (let i = 0; i < pg.length; i++) {
      let wx = pg[i].transform[4]
      let wy = pg[i].transform[5]

      if (wx >= topx && wx <= btmx && wy <= topy && wy >= btmy) {
        words.push(pg[i].str)
      }
    }
    console.log(words)
  }

  const onPageLoadSuccess = async (page) => {
    const pagetext = (await page.getTextContent()).items
    setPageText((prev) => ({ ...prev, [page.pageNumber]: pagetext }))
  }

  return (
    <div className='Example'>
      <header>
        <h1>react-pdf sample page</h1>
      </header>
      <div className='Example__container'>
        <div className='Example__container__load'>
          <label htmlFor={fileId}>Load from file:</label>{' '}
          <input id={fileId} onChange={onFileChange} type='file' />
        </div>

        {file && (
          <div className='Example__container__document'>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
              {Array.from(new Array(numPages), (_el, index) => (
                <div
                  key={`page_${index + 1}`}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginTop: 10,
                  }}
                >
                  <Page
                    pageNumber={index + 1}
                    onLoadSuccess={onPageLoadSuccess}
                  />
                  {/* Transparent overlay for consistent mouse events */}
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
                    onMouseUp={(e) => {
                      handleMouseUp(e, index + 1)
                    }}
                  />
                </div>
              ))}
            </Document>
          </div>
        )}
      </div>
    </div>
  )
}
