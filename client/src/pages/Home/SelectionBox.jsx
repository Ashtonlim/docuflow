import { delCoordFromPage } from '@/features/pdf/pdfSlice'
import { useDispatch } from 'react-redux'
const SelectionBox = ({ coords, canDelete = true }) => {
  const dispatch = useDispatch()
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
        width: coords.width * coords.pageWidth,
        height: coords.height * coords.pageHeight,
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

// style={{
//   position: 'absolute',
//   top: -10,
//   right: -10,
//   background: 'white',
//   border: '1px solid gray',
//   borderRadius: '50%',
//   cursor: 'pointer',
//   padding: '2px 5px',
//   fontSize: '10px',
//   zIndex: 30,
// }}
