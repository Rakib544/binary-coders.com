import { cardData, quotes } from 'data/navbar'
const Plan = () => {
  return (
    <>
      <div className='my-16'>
        <h1 className='text-center text-gray-700 text-5xl font-bold my-16'>
          Our <span className='text-blue-600'>Guid Line</span> Process
        </h1>
        <div className='mx-auto max-w-7xl'>
          <div className='flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4 md:px-0 px-3'>
            {cardData.map((data) => (
              <div key={data.cardImg} className='shadow-md md:w-3/6 md:mt-0 mt-3 md:h-60 p-10'>
                <img src={data.cardImg} className='w-20 h-20 mx-auto' alt='' />
                <h3 className='text-gray-500 font-semibold mt-3 mb-5 text-center'>{data.body}</h3>
              </div>
            ))}
          </div>{' '}
          <div className='flex flex-col mt-5  md:flex-row justify-center items-center md:px-0 px-2 space-x-0 md:space-x-4'>
            {quotes.map((quote) => (
              <div
                key={quote.cardImg}
                className='md:flex items-center space-x-4 shadow-lg rounded-lg p-10'
              >
                <img
                  src={quote.cardImg}
                  className='w-20 h-20 ring-2 rounded-full md:translate-y-0 -translate-y-3  ring-gray-300 ring-offset-2'
                  alt={quote.title}
                />
                <div className='border-l-4 border-gray-200'>
                  <h4 className='mb-6 font-bold text-gray-600 ml-3'>{quote.title}</h4>
                  <p className='ml-3'>{quote.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>{' '}
    </>
  )
}

export default Plan
