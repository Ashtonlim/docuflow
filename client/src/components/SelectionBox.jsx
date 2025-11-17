import { delCoordFromPage } from '@/features/pdf/pdfSlice'
import { useDispatch } from 'react-redux'
const SelectionBox = ({ coords, page, canDelete = false }) => {
  const dispatch = useDispatch()

  // console.log('coords', coords)

  return (
    <div
      className='absolute z-20'
      style={{
        position: 'absolute',
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        cursor: 'default',
        left: `${coords.left * 100}%`,
        top: `${(1 - coords.top) * 100}%`,
        width: (coords.right - coords.left) * page.width,
        height: (coords.top - coords.bottom) * page.height,
        zIndex: 20,
        // pointerEvents: 'auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
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
