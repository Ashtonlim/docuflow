import React from 'react'
import LayoutOne from '@/components/LayoutOne'

const Resources = () => {
  return (
    <LayoutOne>
      <h1>List of useful resources</h1>
      <ul className='list bg-base-100 rounded-box shadow-md'>
        <li className='p-4 pb-2 text-xs tracking-wide opacity-60'>
          Most played songs this week
        </li>

        <li className='list-row'>
          <div className='text-4xl font-thin tabular-nums opacity-30'>01</div>
          <div>
            <img
              className='rounded-box size-10'
              src='https://img.daisyui.com/images/profile/demo/1@94.webp'
            />
          </div>
          <div className='list-col-grow'>
            <div>Dio Lupa</div>
            <div className='text-xs font-semibold uppercase opacity-60'>
              Remaining Reason
            </div>
          </div>
          <button className='btn btn-square btn-ghost'>
            <svg
              className='size-[1.2em]'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <g
                strokeLinejoin='round'
                strokeLinecap='round'
                strokeWidth='2'
                fill='none'
                stroke='currentColor'
              >
                <path d='M6 3L20 12 6 21 6 3z'></path>
              </g>
            </svg>
          </button>
        </li>

        <li className='list-row'>
          <div className='text-4xl font-thin tabular-nums opacity-30'>02</div>
          <div>
            <img
              className='rounded-box size-10'
              src='https://img.daisyui.com/images/profile/demo/4@94.webp'
            />
          </div>
          <div className='list-col-grow'>
            <div>Ellie Beilish</div>
            <div className='text-xs font-semibold uppercase opacity-60'>
              Bears of a fever
            </div>
          </div>
          <button className='btn btn-square btn-ghost'>
            <svg
              className='size-[1.2em]'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <g
                strokeLinejoin='round'
                strokeLinecap='round'
                strokeWidth='2'
                fill='none'
                stroke='currentColor'
              >
                <path d='M6 3L20 12 6 21 6 3z'></path>
              </g>
            </svg>
          </button>
        </li>

        <li className='list-row'>
          <div className='text-4xl font-thin tabular-nums opacity-30'>03</div>
          <div>
            <img
              className='rounded-box size-10'
              src='https://img.daisyui.com/images/profile/demo/3@94.webp'
            />
          </div>
          <div className='list-col-grow'>
            <div>Sabrino Gardener</div>
            <div className='text-xs font-semibold uppercase opacity-60'>
              Cappuccino
            </div>
          </div>
          <button className='btn btn-square btn-ghost'>
            <svg
              className='size-[1.2em]'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <g
                strokeLinejoin='round'
                strokeLinecap='round'
                strokeWidth='2'
                fill='none'
                stroke='currentColor'
              >
                <path d='M6 3L20 12 6 21 6 3z'></path>
              </g>
            </svg>
          </button>
        </li>
      </ul>
    </LayoutOne>
  )
}

export default Resources
