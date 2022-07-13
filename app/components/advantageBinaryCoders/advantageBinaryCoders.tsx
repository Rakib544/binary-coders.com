import { ABCData } from 'data/navbar'
import { Heading } from '../typography'

const AdvantageBinaryCoders = () => {
  return (
    <div className='my-32 '>
      <Heading>Advantage of be a part of Binary Coders</Heading>
      <div className='my-20 md:text-left text-center md:mx-28  md:flex justify-center items-center '>
        {ABCData.map((advantageBC) => (
          <div className='md:p-3.5 p-4' key={advantageBC.id}>
            <img
              className='w-20 h-20 md:m-0 m-auto'
              loading='lazy'
              src={advantageBC.img}
              alt={advantageBC.img}
            />
            <h3 className='text-2xl font-bold my-4 text-slate-700'>{advantageBC.title}</h3>
            <p className='text-slate-500'>{advantageBC.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdvantageBinaryCoders
