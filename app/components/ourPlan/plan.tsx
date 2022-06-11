const Plan = () => {
  return (
    <div className='my-16'>
      <div>
        <h1 className='text-center text-gray-700 text-5xl font-bold my-16'>
          Our <span className='text-sky-500'>Guid Line</span> Process
        </h1>
      </div>
      <div className='mx-auto'>
        <div className='flex flex-col  md:flex-row justify-center items-center space-x-4'>
          <div className=' shadow-lg rounded-lg p-10'>
            <img src='./images/video.png' className='w-24 h-24 rounded-full mx-auto' alt='' />
            <h3 className=' font-semibold my-4'>
              We will try to give as many guides as <br /> needed on IT, soft skills, programming.
            </h3>
          </div>
          <div className='semester-1 text-white shadow-lg rounded-lg p-10'>
            <img src='./images/topic.png' className='w-24 h-24 rounded-full mx-auto' alt='' />
            <h3 className='font-semibold my-4'>
              We will try to give as many guides as <br /> needed on IT, soft skills, programming.
            </h3>
          </div>
          <div className='shadow-lg rounded-lg p-10'>
            <img src='./images/skilled.png' className='w-24 h-24 rounded-full mx-auto' alt='' />
            <h3 className='font-semibold my-4'>
              We will try to give as many guides as <br /> needed on IT, soft skills, programming.
            </h3>
          </div>
        </div>{' '}
      </div>
    </div>
  )
}

export default Plan
