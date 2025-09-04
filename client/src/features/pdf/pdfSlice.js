import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  size: '',
  type: '',
  pages: 0,
  savedCoords: {},
}

export const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    initFile: (state, action) => {
      state.pages = action.payload.numPages
      const { name, size, type } = action.payload
      state.name = name
      state.size = size
      state.type = type

      for (let i = 1; i <= state.pages; i++) {
        state.savedCoords[i] = []
      }
    },

    addCoordToPage: (state, action) => {
      const { pageNumber, coord } = action.payload
      state.savedCoords[pageNumber].push(coord)
    },
    delCoordFromPage: (state, action) => {
      console.log('delCoordFromPage', state, action)
      const { pageNumber, id } = action.payload
      state.savedCoords[pageNumber] = state.savedCoords[pageNumber].filter(
        (cur) => cur.id !== id,
      )
    },
    updateLabel: (state, action) => {
      console.log('updateLabel', state, action)
      const { value, pageNumber, id } = action.payload

      const itemToUpdate = state.savedCoords[pageNumber].find(
        (coord) => coord.id === id,
      )
      if (itemToUpdate) {
        itemToUpdate.label = value // Immer handles immutability
        console.log('update', itemToUpdate)
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { initFile, addCoordToPage, delCoordFromPage, updateLabel } =
  pdfSlice.actions

export default pdfSlice.reducer
