import { useSelector, useDispatch } from 'react-redux'

export function Pdf() {
  const pdf = useSelector((state) => state.pdf.value)
  const dispatch = useDispatch()
  // const addFile = (event) => {
  //   const nextFile = event.target?.files?.[0]
  //   if (nextFile) {
  //     setFile(nextFile)
  //   }
  // }
  return <div></div>
}
