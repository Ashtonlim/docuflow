import config from '@/config'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  size: '',
  type: '',
  pages: 0,
  status: 'idle',
  err: null,
  bounding_boxes: [],
}

export const uploadPDF = createAsyncThunk(
  'docs/uploadDoc',
  async (file, thunkApi) => {
    console.log('trying to upload pdf', file, thunkApi)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const endpoint = `${config.API_URL}/documents`
      console.log('sending to', endpoint)
      const res = await fetch(endpoint, {
        method: 'post',
        body: formData,
      })
      const actual = res.json()
      console.log(res, actual)
      return actual
    } catch (e) {
      console.log('catch part of uploadpdf', e)
      return thunkApi.rejectWithValue(e)
    }
  },
)

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
  extraReducers: (builder) => {
    builder
      .addCase(uploadPDF.pending, (state, action) => {
        console.log(state, action)
      })
      .addCase(uploadPDF.fulfilled, (state, action) => {
        console.log(state, action)
      })
      .addCase(uploadPDF.rejected, (state, action) => {
        console.log(state, action)
      })
  },
})

// Action creators are generated for each case reducer function
export const { initFile, addBoundingBox, delCoordFromPage, updateLabel } =
  pdfSlice.actions

export default pdfSlice.reducer
