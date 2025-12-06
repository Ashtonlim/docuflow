const Steps = ({ at }) => {
  const allSteps = ['Link', 'Verify']
  return (
    <div className='mb-5 w-1/3'>
      <ul className='steps steps-vertical lg:steps-horizontal w-full'>
        {allSteps.slice(0, at + 1).map((word) => (
          <li key={word} className='step step-primary cursor-pointer'>
            {word}
          </li>
        ))}
        {allSteps.slice(at + 1, allSteps.length).map((word) => (
          <li key={word} className='step cursor-not-allowed'>
            {word}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Steps
