import { Link } from 'react-router'

import config from '@/config.js'
import LinkButton from './LinkButton'
import ThemeToggle from './ThemeToggle'

const navLinks = {
  Home: '/',
  About: '/about',
  Templates: '/templates',
  'HSK 2': '/hsk-2',
  'HSK 3': '/hsk-3',
}

const HamburgerIcon = () => (
  <>
    <svg
      className='h-6 w-6'
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
        clipRule='evenodd'
      ></path>
    </svg>
    <svg
      className='hidden h-6 w-6'
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
        clipRule='evenodd'
      ></path>
    </svg>
  </>
)

const Header = () => {
  return (
    <header className='shadow-2xl'>
      <nav className='px-4 py-2.5 lg:px-6'>
        <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between'>
          <Link
            to={`${window.location.protocol}//${window.location.host}${config.BASE_PATH}`}
            className='text-text flex items-center'
          >
            <span className='self-center text-4xl font-semibold whitespace-nowrap'>
              {config.APP_NAME}
            </span>
          </Link>
          <div className='flex items-center lg:order-2'>
            <div>
              <ThemeToggle />
            </div>
            <a
              href='#'
              className='mr-2 rounded-lg px-4 py-2 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 focus:outline-none lg:px-5 lg:py-2.5'
            >
              Log in
            </a>

            <button
              data-collapse-toggle='mobile-menu-2'
              type='button'
              className='ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
              aria-controls='mobile-menu-2'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu</span>
              <HamburgerIcon />
            </button>
          </div>
          <div
            className='hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto'
            id='mobile-menu-2'
          >
            <ul className='mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8'>
              {Object.entries(navLinks).map(([pageName, to]) => {
                return (
                  <li key={pageName}>
                    <LinkButton to={to} pageName={pageName} />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
