import { updateLabel } from '@/features/pdf/pdfSlice'
import { useSelector, useDispatch } from 'react-redux'

const SelectedFields = ({ pageNumber }) => {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  return (
    <div>
      {pdf.savedCoords[pageNumber].map(({ label, id, wordAsStr }, i) => (
        <div>
          {/* <div></div> */}
          <div className='ml-5'>
            {i}:{' '}
            <input
              type='text'
              value={label}
              onChange={(e) =>
                dispatch(
                  updateLabel({
                    value: e.target.value,
                    id,
                    pageNumber,
                  }),
                )
              }
            />{' '}
            - {wordAsStr || ''}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SelectedFields
