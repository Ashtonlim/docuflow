import { delCoordFromPage, setClickedElement } from '@/features/pdf/pdfSlice'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWordsInAreaFromPage } from '@/utils/pdfUtils'

const bg1 = 'rgba(70, 200, 80, 0.55)'
const bg2 = 'rgba(59, 130, 246, 0.2)'

const SelectionBox = ({ coords, page, page_number, canDelete = false }) => {
  const [color, setColor] = useState(true)
  const pdf = useSelector((state) => state.pdf)
  const text = getWordsInAreaFromPage(coords, pdf.pages[page_number])
  const dispatch = useDispatch()

  const toggleClick = (e) => {
    setColor(!color)
    dispatch(setClickedElement(coords.id))
  }

  return (
    <div
      className='absolute z-20'
      style={{
        position: 'absolute',
        border: `2px dashed #3b82f6`,
        backgroundColor: pdf.curSelectedBb === coords.id ? bg1 : bg2,
        cursor: 'default',
        left: `${coords.left * 100}%`,
        top: `${(1 - coords.top) * 100}%`,
        width: (coords.right - coords.left) * page.width,
        height: (coords.top - coords.bottom) * page.height,
        zIndex: 20,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
      onClick={toggleClick}
    >
      <div className='absolute -top-3 z-10 cursor-pointer rounded-full border border-gray-600 bg-white px-1 py-0 text-xs'>
        {text}
      </div>
      {canDelete && (
        <button
          className='absolute -top-3 -right-3 z-30 cursor-pointer rounded-full border border-gray-600 bg-white px-1 py-0 text-sm!'
          onClick={(e) => {
            e.stopPropagation()
            dispatch(delCoordFromPage(coords.id))
          }}
        >
          <span className='text-black'>✕</span>
        </button>
      )}
    </div>
  )
}

export default SelectionBox
