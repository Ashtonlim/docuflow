import config from '@/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const docsApi = createApi({
  reducerPath: 'templatesAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
  }),
  endpoints: (build) => ({
    getDocs: build.query({ query: () => '/documents' }),
    deleteDoc: build.mutation({
      query: (id) => {
        return {
          url: `/documents/${id}`,
          method: 'DELETE',
        }
      },
    }),
  }),
})

export const { useGetDocsQuery, useDeleteDocMutation } = docsApi
