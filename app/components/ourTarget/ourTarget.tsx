import Map from './map'

const ourTarget = () => {
  return (
    <>
      <div className='mx-auto w-11/12 md:my-16'>
        <div className='text-center'>
          <h1 className='text-center text-gray-700 text-5xl font-bold'>
            Our <span className='text-blue-500'>Target</span>
          </h1>
          <h3 className='md:my-16 my-8 font-semibold md:text-2xl md:w-1/2 mx-auto text-gray-700'>
            You will work hard. We will provide whatever content, support and guidelines. Along with
            the account 🤝, the account is correct💪
          </h3>
        </div>
      </div>
      <div className='milestone-content'>
        <Map />
      </div>
    </>
  )
}

export default ourTarget
