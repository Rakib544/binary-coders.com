import { ABCData } from 'data/navbar'
import { Heading } from '../typography'

const AdvantageBinaryCoders = () => {
  return (
    <div className='my-32 '>
      <Heading>Advantages of being a part of Binary Coders</Heading>
      <div className='my-20 md:text-left text-center md:mx-28  grid grid-cols-3'>
        {ABCData.map((advantageBC) => (
          <div className='md:p-3.5 p-4 md:col-span-1 col-span-3' key={advantageBC.id}>
            <img
              className='w-20 h-20 md:m-0 m-auto'
              loading='lazy'
              src={advantageBC.img}
              alt={advantageBC.img}
            />
            <h3 className='text-1xl font-bold my-4 text-slate-700'>{advantageBC.title}</h3>
            <p className='text-slate-500'>{advantageBC.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdvantageBinaryCoders
