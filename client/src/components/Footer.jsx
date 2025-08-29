import React from 'react'
import { Link } from 'react-router'

import config from '@/config'
import LinkButton from './LinkButton'

const navLinks = {
  Home: '/',
  About: '/about',
  'HSK 1': '/hsk-1',
  'HSK 2': '/hsk-2',
  'HSK 3': '/hsk-3',
}

const Footer = () => {
  return (
    <footer className='bg-stone-800'>
      <div className='mx-auto w-full max-w-screen-xl p-4 text-stone-50 md:flex md:items-center md:justify-between'>
        <span className='text-sm'>
          © {new Date().getFullYear()}{' '}
          <Link
            className='hover:underline'
            to={`${window.location.protocol}//${window.location.host}`}
          >
            {config.APP_NAME}™
          </Link>
          . All Rights Reserved.
        </span>

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
    </footer>
  )
}

export default Footer
