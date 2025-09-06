import pdfReducer from '@/features/pdf/pdfSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    pdf: pdfReducer,
  },
})
