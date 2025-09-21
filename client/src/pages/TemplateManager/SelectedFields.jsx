import { updateLabel } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'

const SelectedFields = ({ page_number }) => {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  return (
    <div>
      {pdf.bounding_boxes
        .filter((bb) => bb.page_number === page_number)
        .map(({ label, id, selectedWords }, i) => (
          <div key={id}>
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
                      page_number,
                    }),
                  )
                }
              />{' '}
              - {selectedWords || ''}
            </div>
          </div>
        ))}
    </div>
  )
}

export default SelectedFields
