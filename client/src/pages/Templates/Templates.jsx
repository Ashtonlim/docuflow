import LayoutOne from '@/components/LayoutOne'
import {
  useGetTemplatesQuery,
  useGetDocsQuery,
} from '@/features/template/templateSlice'
import Button from '../../components/Button'
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
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th className='w-4/15'>Actions</th>
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
                  <td>{item.pdf_id}</td>
                  <td className='flex flex-row gap-5'>
                    <Button to={`/templates/${item.pdf_id}`}>
                      Edit Template
                    </Button>
                    <Button
                      type='primary'
                      to={`/templates/extract/${item.pdf_id}/${item.id}`}
                    >
                      Extract
                    </Button>

                    <Button type='danger' onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
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
                  <td className='flex flex-row gap-5'>
                    <Button to={`/templates/${item.id}`}>
                      Create Template
                    </Button>

                    <Button type='danger' onClick={() => handleDelete(item.id)}>
                      Delete All
                    </Button>
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

export default Templates

// okay i have a problem, i uploaded a file,
// A non-serializable value was detected in an action
