import { configureStore } from '@reduxjs/toolkit'
import pdfReducer from '@/features/pdf/pdfSlice'

export const store = configureStore({
  reducer: {
    pdf: pdfReducer,
  },
})
