import { ABCData } from 'data/navbar'

const AdvantageBinaryCoders = () => {
  return (
    <div className='my-32 '>
      <h2 className='text-gray-700 text-center text-4xl font-bold'>
        Advantage of be a part of <span className='text-blue-600'>Binary Coders</span>
      </h2>
      <div className='my-20 md:text-left text-center md:mx-28  md:flex justify-center items-center '>
        {ABCData.map((advantageBC) => (
          <div className='md:p-3.5 p-4' key={advantageBC.id}>
            <img className='w-20 h-20 md:m-0 m-auto' src={advantageBC.img} alt={advantageBC.img} />
            <h3 className='text-2xl font-semibold my-4 text-gray-700'>{advantageBC.title}</h3>
            <p className='text-cyan-900'>{advantageBC.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdvantageBinaryCoders
