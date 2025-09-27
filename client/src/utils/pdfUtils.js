export const getWordsInAreaFromPage = (area, pageData) => {
  const { left, bottom, right, top } = area

  // might not exist if page being loaded in
  if (!pageData) {
    return []
  }
  const { words, width, height } = pageData

  return words
    ?.filter((word) => {
      let x = word.transform[4] / width
      let y = word.transform[5] / height

      // word starting pos inside area
      let xInArea = left <= x && x <= right

      // opposite directions as pdf reads yAxis from bottom to top. i.e. Bottom = 0px, top = heightOfPdf
      let yInArea = top >= y && y >= bottom

      return xInArea && yInArea
    })
    ?.map((word) => (word.str == '' ? ' ' : word.str))
    .join('')
}

export const calcCoordinates = (area, { width, height }) => {
  const [left, bottom, right, top] = area
  return {
    left: left / width,
    bottom: bottom / height,
    right: right / width,
    top: top / height,
  }
}

// // get top left point
// // pdf y coordinates start from btm. pdfy = pdfHeight - YRelativeToPDF
// export const calcCoordinates = (domStart, domEnd, pageData) => {
//   const { width, height } = pageData
//   const [firstClickX, firstClickY] = domStart
//   const [lastClickX, lastClickY] = domEnd
//   const topLeftX = Math.min(firstClickX, lastClickX)
//   const topLeftY = Math.min(firstClickY, lastClickY)

//   // to convert domy into pdfy -> pdfHeight - domy (topLeftY)
//   // right at btm of page, if pdfHeight = 500, then domy = 500
//   // therefore pdfy = 500 - 500 = 0px
//   return {
//     domY: 0,
//     pdfX: topLeftX / width,
//     pdfY: (height - topLeftY) / height,
//     width: Math.abs(firstClickX - lastClickX) / width,
//     height: Math.abs(firstClickY - lastClickY) / height,
//     label_name: 'label name',
//   }
// }
