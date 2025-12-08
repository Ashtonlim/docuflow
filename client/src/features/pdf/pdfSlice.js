import config from '@/config'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  size: '',
  type: '',
  status: 'idle',
  bounding_boxes: [],
  pages: {},
  curSelectedBb: null,
  source: null,
  target: null,
}

export const uploadPDF = createAsyncThunk(
  'docs/uploadDoc',
  async (file, thunkApi) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const endpoint = `${config.API_URL}/documents`
      const res = await fetch(endpoint, {
        method: 'post',
        body: formData,
      })
      const data = await res.json()
      return data
    } catch (e) {
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
    resetFile: (state, action) => {
      state = {
        name: '',
        size: '',
        type: '',
        status: 'idle',
        bounding_boxes: [],
        pages: {},
      }
    },

    reInitFile: (state, action) => {
      // const { name, size, type, bounding_boxes, pdf_id }
      const data = action.payload

      // make backwards compatible - do not break
      state[data?.pdf_id] = {
        name: '',
        size: '',
        type: '',
        status: 'idle',
        bounding_boxes: [],
        pages: {},
        ...data,
      }

      state.name = data?.name || ''
      state.size = data?.size || ''
      state.type = data?.type || ''
      state.bounding_boxes = data?.bounding_boxes || []
      state.pdf_id = data?.pdf_id || ''
    },
    addText: (state, action) => {
      // const { page_number, text } = action.payload
      // if (!(page_number in state.pages)) {
      //   return state
      // }
      // if (Array.isArray(state.pages[page_number].words)) {
      //   state.pages[page_number].found_words.push(text)
      // }
    },
    addPage: (state, action) => {
      const { page_number, page } = action.payload
      state.pages[page_number] = page
      state[action.payload?.pdf_id].pages[page_number] = page
    },

    addBoundingBox: (state, action) => {
      state.bounding_boxes.push(action.payload)
      state[action.payload?.pdf_id]?.bounding_boxes(
        action.payload?.bounding_boxes,
      )
    },
    delCoordFromPage: (state, action) => {
      state.bounding_boxes = state.bounding_boxes.filter(
        (cur) => cur.id !== action.payload,
      )

      state[action.payload?.pdf_id].bounding_boxes = state[
        action.payload?.pdf_id
      ]?.bounding_boxes.filter((cur) => cur.id !== action.payload)
    },
    updateLabel: (state, action) => {
      const { value, id } = action.payload

      const itemToUpdate = state.bounding_boxes.find((coord) => coord.id === id)
      if (itemToUpdate) {
        itemToUpdate.label = value
      }

      const itemToUpdate2 = state[action.payload?.pdf_id]?.bounding_boxes.find(
        (coord) => coord.id === id,
      )
      if (itemToUpdate2) {
        itemToUpdate2.label = value
      }
    },
    setClickedElement: (state, action) => {
      state.curSelectedBb = action.payload
    },
    setSourceFile: (state, action) => {
      state.source = action.payload
    },
    setTargetFile: (state, action) => {
      state.target = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPDF.pending, (state, action) => {})
      .addCase(uploadPDF.fulfilled, (state, action) => {
        state.goto = action.payload.id
      })
      .addCase(uploadPDF.rejected, (state, action) => {})
  },
})

// Action creators are generated for each case reducer function
export const {
  initFile,
  resetFile,
  reInitFile,
  addPage,
  addText,
  addBoundingBox,
  delCoordFromPage,
  updateLabel,
  setClickedElement,
  setSourceFile,
  setTargetFile,
} = pdfSlice.actions

export default pdfSlice.reducer
