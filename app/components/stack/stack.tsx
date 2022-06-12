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
            <div
              key={stack.cardImg}
              className='mx-2 my-8 shadow-md md:w-1/4 md:h-86 rounded-2xl p-10'
            >
              <img src={stack.cardImg} className='w-24 h-24 mx-auto' alt='' />
              <h2 className='text-center'>{stack.stackName}</h2>
              <p className='text-gray-500 font-semibold mt-3 mb-5 text-center '>{stack.body}</p>
              <button
                className='flex items-center justify-center mx-auto block'
                style={stack.btnStyle}
              >
                <span className='font-semibold'>Read more </span>
                <span
                  className={' p-2 w-10 h-10 rounded-full'}
                  style={{
                    marginRight: '-23px',
                    marginLeft: '30px',
                    backgroundColor: `${stack.btnStyle.border.slice(10)}`,
                  }}
                >
                  <img src='./images/arrow.png' alt='' />
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* <div className='grid grid-flow-col grid-rows-2 grid-cols-3 gap-8'>
          <div>
            <img
              src='https://tailwindcss.com/_next/static/media/1.255e1a9895b6ee4eefa3c44eadaf40ae.jpg'
              alt=''
              loading='lazy'
              className='rounded-2xl'
            />
          </div>
          <div className='col-start-3'>
            <img
              src='https://tailwindcss.com/_next/static/media/2.d0303c78580c2c7a6a10849f251ac78d.jpg'
              alt=''
              loading='lazy'
              className='rounded-2xl'
            />
          </div>
          <div>
            <img
              src='https://tailwindcss.com/_next/static/media/3.dae6d3779aa815c2e284a432cf0cf0ec.jpg'
              alt=''
              loading='lazy'
              className='rounded-2xl'
            />
          </div>
          <div>
            <img
              src='https://tailwindcss.com/_next/static/media/4.b3ded4dca4fa6d4b3fc9c8f7acd127a6.jpg'
              alt=''
              loading='lazy'
              className='rounded-2xl'
            />
          </div>
          <div className='row-start-1 col-start-2 col-span-2'>
            <img
              src='https://tailwindcss.com/_next/static/media/5.cb3efb05f0114abf9efaa0ddbeaed688.jpg'
              alt=''
              loading='lazy'
              className='rounded-2xl'
            />
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Stack
