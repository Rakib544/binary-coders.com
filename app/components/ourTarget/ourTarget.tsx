import { motion } from 'framer-motion'
import { Heading } from '../typography'
import Map from './map'

const ourTarget = () => {
  return (
    <>
      <motion.div
        className='mx-auto w-11/12 mt-24 md:mb-16 md:mt-32'
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className='text-center'>
          <Heading>Our Target</Heading>
          <h3 className='md:mb-16 mb-8 text-lg md:w-1/2 mx-auto text-slate-500'>
            You will work hard. We will provide whatever content, support and guidelines. Along with
            the account 🤝, the account is correct💪
          </h3>
        </div>
      </motion.div>
      <div className='milestone-content'>
        <Map />
      </div>
    </>
  )
}

export default ourTarget
