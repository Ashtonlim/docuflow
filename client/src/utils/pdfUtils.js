export const getWordsInAreaFromPage = (area, pageData) => {
  const { left, bottom, right, top } = area

  // might not exist if page being loaded in
  if (!pageData) {
    return []
  }

  const { words, width, height } = pageData

  const found = words
    ?.filter((word) => {
      const x = word.transform[4] / width
      const y = word.transform[5] / height

      // word starting pos inside area
      const xInArea = left <= x && x <= right

      // opposite directions as pdf reads yAxis from bottom to top. i.e. Bottom = 0px, top = heightOfPdf
      const yInArea = top >= y && y >= bottom

      return xInArea && yInArea
    })
    ?.map((word) => {
      return word.str == '' ? ' ' : word.str
    })
    ?.join('')

  return found
}

export const normalisePoints = (area, width, height) => {
  const [left, bottom, right, top] = area
  return {
    left: left / width,
    bottom: bottom / height,
    right: right / width,
    top: top / height,
  }
}
