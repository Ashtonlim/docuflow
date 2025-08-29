import { Link } from 'react-router'

const LinkButton = ({ to = '/', pageName = 'Home' }) => {
  return (
    <Link
      to={to}
      className='text-text block rounded py-2 pr-4 pl-3 lg:bg-transparent lg:p-0'
      aria-current='page'
    >
      {pageName}
    </Link>
  )
}
export default LinkButton
