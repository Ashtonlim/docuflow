import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const SelectionBox = ({ coords, page }) => {
  // useEffect(() => {
  //   // console.log('SelectionBox', page)
  // }, [page])

  if (!page.width || !page.height) return <div></div>

  return (
    <div
      className='absolute z-20'
      style={{
        position: 'absolute',
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        cursor: 'default',
        left: `${coords.pdfX * 100}%`,
        top: `${coords.domY * 100}%`,
        width: coords.width * page.width,
        height: coords.height * page.height,
        zIndex: 20,
        // pointerEvents: 'auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    ></div>
  )
}

export default SelectionBox
