import React from 'react'

const Stat = ({ correct = 0, total = 0 }) => {
  return (
    <div className='stats card bg-base-100 card-xs my-3 w-full shadow shadow-sm lg:w-1/3'>
      <div className='stat'>
        <h6>Correct</h6>
        <div className='stat-value text-pri'>{correct}</div>
        {/* <div className='stat-desc'>21% more than last month</div> */}
      </div>

      <div className='stat'>
        <h6>Wrong</h6>
        <div className='stat-value'>{total - correct}</div>
        {/* <div className='stat-desc'>21% more than last month</div> */}
      </div>

      <div className='stat'>
        <h6>Total</h6>
        <div className='stat-value text-sec'>{total}</div>
        {/* <div className='stat-desc text-pri'>31 tasks remaining</div> */}
      </div>
    </div>
  )
}

export default Stat
