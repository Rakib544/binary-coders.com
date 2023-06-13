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
    <div className='px-4 md:px-12 my-8 max-w-screen-xl mx-auto'>
      <div className='grid grid-cols-2 w-full items-center text-center md:text-left'>
        <div className='col-span-2  md:col-span-1 order-2 md:order-1'>
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
            <motion.div variants={childVariants}>
              <Paragraph className='my-2 text-slate-500'>
                Join with us if you want to get a complete guidelines to become a skilled junior
                programmer from scratch. 😇😊
              </Paragraph>
            </motion.div>
            <motion.div
              variants={childVariants}
              className='buttons mt-6 md:flex items-center space-x-4'
            >
              <Link
                prefetch='intent'
                to='/blog'
                className='px-12 border-2 border-blue-500 sm:px-12 py-3 md:py-3 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 hover:border-blue-600 transition duration-200 shadow-blue-500/50 inline-block my-4'
              >
                See Blogs
              </Link>

              <Link
                prefetch='intent'
                to='/problems'
                className='px-8 sm:px-12 py-3 md:py-3 sm:py-3  bg-blue-500 border-2 border-blue-500 hover:border-blue-600 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block my-4'
              >
                Solve Problems
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className='col-span-2 md:col-span-1 order-1 md:order-2 p-12'>
          <motion.img
            src='./images/programming.svg'
            height='400'
            width='600'
            alt='right-side-heading-img'
            className='ml-0 lg:ml-8'
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
