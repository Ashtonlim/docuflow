import config from '@/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const docsApi = createApi({
  reducerPath: 'templatesAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
  }),
  endpoints: (build) => ({
    getDocs: build.query({ query: () => '/documents' }),
    getPDF: build.query({ query: (id) => `/documents/${id}` }),
    getTemplates: build.query({ query: () => '/templates/basic' }),
    getTemplate: build.query({ query: (id) => `/templates/${id}` }),
    createTemplate: build.mutation({
      query: (body) => {
        return {
          url: `/templates`,
          method: 'POST',
          body,
        }
      },
    }),
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

export const {
  useGetDocsQuery,
  useGetPDFQuery,
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useDeleteDocMutation,
  useCreateTemplateMutation,
} = docsApi
