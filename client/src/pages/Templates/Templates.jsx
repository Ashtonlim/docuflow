import LayoutOne from '@/components/LayoutOne'
import {
  useDeleteDocMutation,
  useGetDocsQuery,
} from '@/features/template/templateSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
const Templates = () => {
  // const pdf = useSelector((state) => state.pdf)
  const dispatch = useDispatch()
  const { data, error, isLoading } = useGetDocsQuery()

  // useEffect(() => {
  //   const init = async () => {
  //     dispatch()
  //   }

  //   return () => {
  //     second
  //   }
  // }, [third])
  console.log(data, isLoading)

  return (
    <LayoutOne>
      <div className='rounded-box border-base-content/5 bg-base-100 overflow-x-auto border'>
        {isLoading ? (
          <span className='loading loading-spinner loading-xs'></span>
        ) : (
          <TemplatesTable data={data} />
        )}
      </div>
    </LayoutOne>
  )
}

const TemplatesTable = ({ data }) => {
  const [del, { isLoading, isUpdating }] = useDeleteDocMutation()
  console.log(isLoading, isUpdating, del, data)
  const handleDelete = (id) => {
    del(id)
  }
  return (
    <table className='table'>
      {/* head */}
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data
          ? data.map((docData, i) => (
              <tr key={docData.id}>
                <th>{i}</th>
                <td>{docData.file_name}</td>
                <td>{docData.id}</td>
                <td>
                  <Link to={`/templates/${docData.id}`}>
                    <button className='btn'>Edit</button>
                  </Link>
                  <button
                    className='btn ml-2'
                    onClick={() => handleDelete(docData.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          : 'sth went wrong'}
      </tbody>
    </table>
  )
}

export default Templates

// okay i have a problem, i uploaded a file,

// A non-serializable value was detected in an action
