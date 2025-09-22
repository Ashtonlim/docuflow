import LayoutOne from '@/components/LayoutOne'
import {
  useGetTemplatesQuery,
  useDeleteDocMutation,
  useGetDocsQuery,
} from '@/features/template/templateSlice'
import { Link } from 'react-router'
const Templates = () => {
  // const pdf = useSelector((state) => state.pdf)

  const {
    data: templates,
    error: templatesError,
    isLoading: templatesLoading,
  } = useGetTemplatesQuery()

  const {
    data: docs,
    error: docsError,
    isLoading: docsLoading,
  } = useGetDocsQuery()

  return (
    <LayoutOne>
      <div className='rounded-box border-base-content/5 bg-base-100 overflow-x-auto border'>
        <table className='table'>
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templatesLoading ? (
              <div className='loading loading-spinner loading-xs' />
            ) : (
              templates?.map((item, i) => (
                <tr key={item.id}>
                  <th>{i + 1}</th>
                  <td>{item.id}</td>
                  <td>{item.file_name}</td>
                  <td>
                    <Link to={`/templates/${item.pdf_id}`}>
                      <button className='btn'>Edit Template</button>
                    </Link>
                    <Link to={`/templates/extract/${item.pdf_id}`}>
                      <button className='btn btn-neutral ml-2'>Extract</button>
                    </Link>
                    <button
                      className='btn btn-error ml-2'
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            {docsLoading ? (
              <span className='loading loading-spinner loading-xs' />
            ) : (
              docs?.map((item, i) => (
                <tr key={item.id}>
                  <th>{i + 1}</th>
                  <td>{item.id}</td>
                  <td>{item.file_name}</td>
                  <td>
                    <Link to={`/templates/${item.id}`}>
                      <button className='btn'>Create Template</button>
                    </Link>

                    <button
                      className='btn btn-error ml-2'
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </LayoutOne>
  )
}

// const TemplatesTable = ({ data, isTemplates }) => {
//   const [del, { isLoading, isUpdating }] = useDeleteDocMutation()
//   const handleDelete = (id) => {
//     del(id)
//   }
//   return (

//   )
// }

export default Templates

// okay i have a problem, i uploaded a file,

// A non-serializable value was detected in an action
