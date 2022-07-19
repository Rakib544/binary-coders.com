import { blurImgUrl } from 'data/blur-img-url'
import { stackCard } from 'data/navbar'
import BlurrableImage from '../blurable-img'
import { Heading } from '../typography'
const Stack = () => {
  return (
    <div className='px-4 md:px-12 mt-32'>
      <Heading>Binary coders Features</Heading>
      <div className='grid gap-4 md:gap-8 grid-cols-3 items-center p-3 mt-10'>
        {stackCard.map((stack) => (
          <div
            key={stack.id}
            className='col-span-3 md:col-span-1 bg-white shadow-2xl shadow-blue-500/10 rounded-lg h-full'
          >
            <div className='p-8'>
              <BlurrableImage
                blurDataURl={blurImgUrl}
                className='h-40 w-60 mx-auto relative'
                img={
                  <img
                    src={stack.cardImg}
                    loading='lazy'
                    height='400'
                    width='400'
                    className='mx-auto h-40 w-auto'
                    alt='card-img'
                  />
                }
              />
            </div>
            <div className='px-4'>
              <h2 className='text-center font-bold mt-4 text-sky-500 '>{stack.stackName}</h2>
              <p className='text-slate-500 tracking-normal mt-3 mb-5 text-justify '>{stack.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stack
