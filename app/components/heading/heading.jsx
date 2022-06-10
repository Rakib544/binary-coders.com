import { Link } from '@remix-run/react'

const Heading = () => {
  return (
    <div className='mx-auto w-11/12'>
      <div className='md:flex justify-center items-center'>
        <div className='md:w-1/2 flex'>
          <div>
            <h3 className='text-2xl'>CSE Fundamentals:</h3>
            <h1 className='text-5xl my-5 font-bold text-gray-600'>
              Grab the Opportunity You Missed
            </h1>
            <h4 className='text-gray-600 text-xl'>
              Join with use if you want to get a complete guideline to become a good skilled junior
              programmer from scratch. 😇😊
            </h4>
            <div className='buttons mt-6'>
              <button className='mt-4 inline-block mx-2 px-10 py-3 bg-blue-600 text-white rounded-full'>
                <Link to='/blog'>See Blogs</Link>
              </button>
              <button className='mt-4 inline-block mx-2 px-10 py-3 border-2 border-blue-600 text-black hover:bg-blue-600 transition duration-300 hover:text-white rounded-full'>
                <Link to='/forum'>Create forums</Link>
              </button>
            </div>
          </div>
        </div>
        <div className='md:w-1/2 '>
          <img src='./images/preview.jpg' alt='right-side-heading-img' />
        </div>
      </div>
    </div>
  )
}

export default Heading
