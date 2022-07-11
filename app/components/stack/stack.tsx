import { stackCard } from 'data/navbar'
const Stack = () => {
  return (
    <div className='mt-32'>
      <h1 className='text-center text-gray-700 text-5xl font-bold my-16'>
        Binary coders <span className='text-blue-500'>Features</span>
      </h1>
      <div className='mx-auto max-w-7xl md:px-0 px-3'>
        <div className='flex justify-center md:flex-row items-center flex-wrap p-3'>
          {stackCard.map((stack) => (
            <div key={stack.id} className='mx-2 my-8 md:w-1/4 md:h-86 rounded-2xl stack--card'>
              <div className='p-8'>
                <img src={stack.cardImg} className='mx-auto' alt='' />
              </div>
              <div className='px-4'>
                <h2 className=' text-center font-bold mt-4 text-blue-500 '>{stack.stackName}</h2>
                <p className='text-gray-600 font-semibold mt-3 mb-5 text-justify '>{stack.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stack
