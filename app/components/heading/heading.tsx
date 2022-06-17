import { Link } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'

const Heading = () => {
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  return (
    <div className='mx-auto w-11/12'>
      <div className='md:flex justify-center items-center'>
        <div className='md:w-1/2 flex order-2 md:order-1'>
          <motion.div
            initial='initial'
            animate='visible'
            variants={{
              initial: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.h3 variants={childVariants} className='text-2xl'>
              CSE Fundamentals:
            </motion.h3>
            <motion.h1 variants={childVariants} className='text-5xl my-5 font-bold text-gray-600'>
              Grab the Opportunity You Missed
            </motion.h1>
            <motion.h4 variants={childVariants} className='text-gray-600 text-xl'>
              Join with use if you want to get a complete guideline to become a good skilled junior
              programmer from scratch. 😇😊
            </motion.h4>
            <motion.div variants={childVariants} className='buttons mt-6 sm:flex'>
              <button className='mt-4 mx-2  px-10 py-3 bg-blue-600 text-white rounded-full'>
                <Link to='/blog'>See Blogs</Link>
              </button>
              <button className='mt-4 px-10 py-3 border-2 bg-gray-200 border-blue-600 text-black hover:bg-blue-600 transition duration-300 hover:text-white rounded-full'>
                <Link to='/forums'>Create forums</Link>
              </button>
            </motion.div>
          </motion.div>
        </div>
        <div className='md:w-1/2 order-1 md:order-2'>
          <motion.img
            src='./images/preview.jpg'
            className=''
            alt='right-side-heading-img'
            initial={{ scale: shouldReduceMotion ? 1 : 1.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.75 }}
          />
        </div>
      </div>
    </div>
  )
}

export default Heading
