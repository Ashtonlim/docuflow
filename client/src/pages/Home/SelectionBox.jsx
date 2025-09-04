import { useDispatch } from 'react-redux'
import { delCoordFromPage } from '@/features/pdf/pdfSlice'
const SelectionBox = ({ coords, canDelete = true }) => {
  // console.log('add', coords)
  const dispatch = useDispatch()
  return (
    <div
      style={{
        position: 'absolute',
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        cursor: 'default',
        left: coords.pdfX,
        top: coords.domY,
        width: coords.width,
        height: coords.height,
        zIndex: 20,
        // pointerEvents: 'auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            dispatch(delCoordFromPage(coords))
          }}
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            background: 'white',
            border: '1px solid gray',
            borderRadius: '50%',
            cursor: 'pointer',
            padding: '2px 5px',
            fontSize: '10px',
            zIndex: 30,
          }}
        >
          <span className='text-black'>✕</span>
        </button>
      )}
    </div>
  )
}

export default SelectionBox
