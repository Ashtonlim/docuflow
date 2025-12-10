import config from '@/config'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: 'idle',
  curSelectedBb: null,
  0: {
    name: '',
    size: '',
    type: '',
    status: 'idle',
    bounding_boxes: [],
    pages: {},
    curSelectedBb: null,
  },
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
      const { pdf_id, data } = action.payload
      console.log(data)
      // make backwards compatible - do not break
      state[pdf_id] = {
        name: '',
        size: '',
        type: '',
        status: 'idle',
        bounding_boxes: [],
        pages: {},
        ...data,
      }
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
      const { page_number, page, pdf_id } = action.payload
      // console.log(ad)
      if (pdf_id) {
        console.log('handle add page ', page_number)
        state[pdf_id].pages[page_number] = page
      }
    },

    addBoundingBox: (state, action) => {
      const { coord, pdf_id } = action.payload
      // state.bounding_boxes.push(coord)
      if (pdf_id) {
        state[pdf_id].bounding_boxes.push(coord)
      }
    },
    setBoundingBox: (state, action) => {
      const { boxes, pdf_id } = action.payload
      state[pdf_id].bounding_boxes.push(...boxes)
    },
    delCoordFromPage: (state, action) => {
      // state.bounding_boxes = state.bounding_boxes.filter(
      //   (cur) => cur.id !== action.payload,
      // )

      state[action.payload?.pdf_id].bounding_boxes = state[
        action.payload?.pdf_id
      ]?.bounding_boxes.filter((cur) => cur.id !== action.payload)
    },
    updateLabel: (state, action) => {
      const { value, id } = action.payload

      const itemToUpdate = state[action.payload?.pdf_id]?.bounding_boxes.find(
        (coord) => coord.id === id,
      )
      if (itemToUpdate) {
        itemToUpdate.label = value
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
  setBoundingBox,
  delCoordFromPage,
  updateLabel,
  setClickedElement,
  setSourceFile,
  setTargetFile,
} = pdfSlice.actions

export default pdfSlice.reducer
