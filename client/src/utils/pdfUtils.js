export const getWordsInAreaFromPage = (area, pageData) => {
  // pdfX,Y should always be top left of area in PDF coordinates (y inversed)
  // btmx and btmy are bottom right of area
  const { pdfX: startX, pdfY: startY, btmx: endX, btmy: endY } = area

  // might not exist if page being loaded in
  if (!pageData) {
    return []
  }
  const { words, width, height } = pageData

  return words
    ?.filter((word) => {
      let pdfBtmLeftX = word.transform[4] / width
      let pdfBtmLeftY = word.transform[5] / height

      // word starting pos inside area
      let xInArea = startX <= pdfBtmLeftX && pdfBtmLeftX <= endX

      // opposite directions as pdf reads yAxis from bottom to left. i.e. Bottom = 0px, top = heightOfPdf
      let yInArea = startY >= pdfBtmLeftY && pdfBtmLeftY >= endY

      return xInArea && yInArea
    })
    ?.map((word) => (word.str == '' ? ' ' : word.str))
}
// get top left point
// pdf y coordinates start from btm. pdfy = pdfHeight - YRelativeToPDF
export const calcCoordinates = (domStart, domEnd, pageData) => {
  const { width, height } = pageData
  const [firstClickX, firstClickY] = domStart
  const [lastClickX, lastClickY] = domEnd
  const topLeftX = Math.min(firstClickX, lastClickX)
  const topLeftY = Math.min(firstClickY, lastClickY)

  // to convert domy into pdfy -> pdfHeight - domy (topLeftY)
  // right at btm of page, if pdfHeight = 500, then domy = 500
  // therefore pdfy = 500 - 500 = 0px
  return {
    domY: topLeftY / height,
    pdfX: topLeftX / width,
    pdfY: (height - topLeftY) / height,
    width: Math.abs(firstClickX - lastClickX) / width,
    height: Math.abs(firstClickY - lastClickY) / height,
    label_name: 'label name',
  }
}
