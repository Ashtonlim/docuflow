import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  size: '',
  type: '',
  pages: 0,
  bounding_boxes: [],
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
        state.bounding_boxes[i] = []
      }
    },

    addBoundingBox: (state, action) => {
      state.bounding_boxes.push(action.payload)
    },
    delCoordFromPage: (state, action) => {
      console.log('delCoordFromPage', state, action)
      state.bounding_boxes = state.bounding_boxes.filter(
        (cur) => cur.id !== action.payload,
      )
    },
    updateLabel: (state, action) => {
      console.log('updateLabel', state, action)
      const { value, id } = action.payload

      const itemToUpdate = state.bounding_boxes.find((coord) => coord.id === id)
      if (itemToUpdate) {
        itemToUpdate.label = value
        console.log('update', itemToUpdate)
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { initFile, addBoundingBox, delCoordFromPage, updateLabel } =
  pdfSlice.actions

export default pdfSlice.reducer
