import { blurImgUrl } from 'data/blur-img-url'
import { cardData } from 'data/navbar'
import BlurrableImage from '../blurable-img'
import { Heading } from '../typography'

const Plan = () => {
  return (
    <>
      <div className='my-16'>
        <Heading className='mb-8'>Our Guideline Process</Heading>
        <div className='px-4 md:px-12 my-8'>
          <div className='flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4 md:px-0 px-3'>
            {cardData.map((data) => (
              <div
                key={data.cardImg}
                className='shadow-2xl shadow-blue-500/10 md:w-3/6 md:mt-0 mt-3 md:h-64 p-10 bg-white rounded-lg'
              >
                <BlurrableImage
                  blurDataURl={blurImgUrl}
                  className='h-20 w-20 mx-auto relative'
                  img={
                    <img
                      src={data.cardImg}
                      loading='lazy'
                      className='w-20 h-20 mx-auto'
                      alt={data.cardImg}
                    />
                  }
                />
                <p className='text-slate-500 text-md mt-3 mb-5 text-center'>{data.body}</p>
              </div>
            ))}
          </div>{' '}
          {/* <div className='flex flex-col mt-5  md:flex-row justify-center items-center md:px-0 px-2 space-x-0 md:space-x-4'>
            {quotes.map((quote) => (
              <div
                key={quote.cardImg}
                className='md:flex items-center space-x-4 rounded-lg p-10 bg-white shadow-2xl shadow-blue-500/10 md:mt-0 mt-6'
              >
                <BlurrableImage
                  blurDataURl={blurImgUrl}
                  className='h-20 w-60 relative'
                  img={
                    <img
                      src={quote.cardImg}
                      loading='lazy'
                      className='w-20 h-20 ring-2 rounded-full md:translate-y-0 -translate-y-3  -ml-6 md:-ml-0 mt-2 ring-gray-300 ring-offset-2'
                      alt={quote.title}
                    />
                  }
                />

                <div className='border-l-4 border-gray-200'>
                  <h4 className='mb-6 font-bold text-slate-700 ml-3'>{quote.title}</h4>
                  <p className='ml-3 text-slate-500'>{quote.body}</p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>{' '}
    </>
  )
}

export default Plan
