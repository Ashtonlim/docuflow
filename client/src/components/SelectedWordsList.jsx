import { updateLabel } from '@/features/pdf/pdfSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getWordsInAreaFromPage } from '@/utils/pdfUtils'

const LIST_ITEM_LIMIT = 30
const SelectedWordsList = ({ page_number }) => {
  const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()

  return pdf.pages[page_number] ? (
    <div>
      {pdf.bounding_boxes
        .filter((box) => box.page_number === page_number)
        .map((box, i) => {
          const { label, id, selectedWords } = box

          // TODO: potentially need to add words into redux state? Review
          // REVIEW: why am i doing getWordsInAreaFromPage()? the box should alr include thw words
          let text =
            selectedWords || getWordsInAreaFromPage(box, pdf.pages[page_number])

          return (
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
                - {text}
              </div>
            </div>
          )
        })
        .slice(0, LIST_ITEM_LIMIT)}
    </div>
  ) : (
    <div>loading page {page_number}</div>
  )
}

export default SelectedWordsList
