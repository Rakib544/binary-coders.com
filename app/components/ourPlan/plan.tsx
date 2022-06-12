const Plan = () => {
  const cardData = [
    {
      cardImg: './images/video.png',
      body: 'We will try to give as many guides as needed on IT, soft skills, programming.',
    },
    {
      cardImg: './images/skilled.png',
      body: 'Each lesson has been prepared by a simple and competent instructor.',
    },
    {
      cardImg: './images/topic.png',
      body: 'At the end of the topic, there are quizzes and exams for merit verification. Issuance of certificate at the end of the course.',
    },
  ]
  const quotes = [
    {
      cardImg: './images/user1.jpg',
      title: 'You can be skilled anytime',
      body: 'Traditionally we go to school-college and receive our education. But with the advent of online media, we now have the opportunity to become proficient at any time, from anywhere, using only electronic devices.',
    },
    {
      cardImg: './images/user2.jpg',
      title: 'We think the guideline is the first step in your future',
      body: 'We usually get various tutorials online in English. However, on the Binary Coders platform we can now easily learn international quality courses. As a result, the way to become efficient is being expanded effortlessly.',
    },
  ]
  return (
    <>
      <div className='my-16'>
        <h1 className='text-center text-gray-700 text-5xl font-bold my-16'>
          Our <span className='text-blue-500'>Guid Line</span> Process
        </h1>
        <div className='mx-auto max-w-7xl'>
          <div className='flex flex-col  md:flex-row justify-center items-center space-x-4'>
            {cardData.map((data) => (
              <div key={data.cardImg} className='shadow-md w-3/6 h-60 rounded-lg p-10'>
                <img src={data.cardImg} className='w-24 h-24 rounded-full mx-auto' alt='' />
                <h3 className='text-gray-500 font-semibold mt-3 mb-5 text-center'>{data.body}</h3>
              </div>
            ))}
          </div>{' '}
          <div className='flex flex-col mt-5  md:flex-row justify-center items-center space-x-4'>
            {quotes.map((quote) => (
              <div
                key={quote.cardImg}
                className='flex items-center space-x-4 shadow-lg rounded-lg p-10'
              >
                <img
                  src={quote.cardImg}
                  className='w-20 h-20 ring-2 rounded-full ring-gray-300 ring-offset-2'
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
