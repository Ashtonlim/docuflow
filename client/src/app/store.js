import pdfReducer from '@/features/pdf/pdfSlice'
import { docsApi } from '@/features/template/templateSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    pdf: pdfReducer,
    [docsApi.reducerPath]: docsApi.reducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(docsApi.middleware),
})

// setupListeners(store.dispatch)
