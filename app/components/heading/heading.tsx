import { Link } from '@remix-run/react'
import { motion, useReducedMotion } from 'framer-motion'
import { H1, H4, Paragraph } from '../typography'

const Heading = () => {
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  return (
    <div className='px-4 md:px-12 my-8'>
      <div className='grid grid-cols-2 items-center'>
        <div className='col-span-2 md:col-span-1 order-2 md:order-1'>
          <motion.div
            initial='initial'
            animate='visible'
            variants={{
              initial: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.div variants={childVariants}>
              <H4 className='font-normal my-2'>Programming Fundamentals:</H4>
            </motion.div>
            <motion.div variants={childVariants}>
              <H1>Grab the Opportunity You Missed</H1>
            </motion.div>
            <motion.div>
              <Paragraph className='my-2'>
                Join with use if you want to get a complete guideline to become a good skilled
                junior programmer from scratch. 😇😊
              </Paragraph>
            </motion.div>
            <motion.div
              variants={childVariants}
              className='buttons mt-6 md:flex items-center space-x-4'
            >
              <Link
                to='/blog'
                className='px-8 sm:px-12 py-2 sm:py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block'
              >
                See Blogs
              </Link>

              <Link
                to='/problems'
                className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block'
              >
                Solve Problems
              </Link>
              {/* <Link
                to='/problems'
                className='mt-4 px-8 sm:px-12 py-3 border-2  border-blue-600 text-black hover:bg-blue-600 transition duration-300 hover:text-white rounded-full inline-block'
              >
                Solve Problems
              </Link> */}
            </motion.div>
          </motion.div>
        </div>
        <div className='col-span-2 md:col-span-1 order-1 md:order-2 p-12'>
          <motion.img
            src='./images/programming.svg'
            className=''
            alt='right-side-heading-img'
            initial={{ scale: shouldReduceMotion ? 1 : 1.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}

export default Heading
