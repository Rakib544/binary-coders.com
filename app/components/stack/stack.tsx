import { stackCard } from 'data/navbar'
const Stack = () => {
  return (
    <div className='mt-32'>
      <h1 className='text-center text-gray-700 text-5xl font-bold my-16'>
        <span className='text-blue-500'>Front-End </span>Stack
      </h1>
      <div className='mx-auto max-w-6xl md:px-0 px-3'>
        <div className='flex justify-center md:flex-row items-center flex-wrap '>
          {stackCard.map((stack) => (
            <div key={stack.id} className='mx-2 my-8 md:w-1/4 md:h-86 rounded-2xl p-10 stack--card'>
              <div
                className='stack--overflow--circle'
                style={{
                  backgroundColor: `${stack.btnStyle.border.slice(10)}`,
                }}
              ></div>
              <img src={stack.cardImg} className='h-24 mx-auto' alt='' />
              <h2 className='text-center font-semibold mt-4'>{stack.stackName}</h2>
              <p className='text-gray-500 font-semibold mt-3 mb-5 text-center '>{stack.body}</p>
              <button
                className='flex items-center justify-center mx-auto block'
                style={stack.btnStyle}
              >
                <span className='font-semibold'>
                  {' '}
                  <a href={stack.link} target='_blank' rel='noreferrer'>
                    Read more
                  </a>
                </span>
                <span
                  className={' p-2 w-10 h-10 rounded-full'}
                  style={{
                    marginRight: '-23px',
                    marginLeft: '30px',
                    backgroundColor: `${stack.btnStyle.border.slice(10)}`,
                  }}
                >
                  <a href={stack.link} target='_blank' rel='noreferrer'>
                    <img src='./images/arrow.png' alt='' />
                  </a>
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stack
