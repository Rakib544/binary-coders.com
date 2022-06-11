import { Link } from '@remix-run/react'

const Footer = () => {
  return (
    <div className='py-16 footer-bg text-white'>
      <div className='grid grid-cols-3 gap-4 md:px-16'>
        <div className=''>
          <img
            src='https://i.ibb.co/KX9YN7Z/logo-01.png'
            className='h-16 hover:scale-105 transition duration-300 ease-in cursor-grab mb-8'
            alt='brand logo'
          />
          <div>
            <h2 className='text-left font-semibold '>
              A platform who tech and guid those student, who actually want learn programming . We
              believe that learning programming is nothing but <span className='text-2xl'>FUN</span>
            </h2>
          </div>
          <div className='flex items-center justify-start space-x-3 mt-8'>
            <img src='./images/facebook.png' className='w-6 h-6' alt='facebook icon' />
            <img src='./images/instagram.png' className='w-6 h-6' alt='instagram icon' />
            <img src='./images/linkedin.png' className='w-6 h-6' alt='linkedin icon' />
            <img src='./images/youtube.png' className='w-6 h-6' alt='youtube icon' />
          </div>
        </div>
        <div className=''>
          <h2 className='font-semibold mb-8'>
            {' '}
            Important Links <img src='./images/links.png' className='inline-flex w-6' alt='' />
          </h2>
          <ul className='space-y-3'>
            <li>
              <Link className='hover:border-b-2' to='/blog'>
                Know more about us
              </Link>
            </li>
            <li>
              <Link className='hover:border-b-2' to='/blog'>
                Blog
              </Link>
            </li>
            <li>
              <Link className='hover:border-b-2' to='/blog'>
                Create forms
              </Link>
            </li>
          </ul>
        </div>
        <div className=''>
          <h2 className='font-semibold mb-8'>
            {' '}
            Find Us{' '}
            <img src='./images/location.png' className='inline-flex ml-2 w-6' alt='location' />
          </h2>
          <ul className='space-y-4 '>
            <li>
              <img
                src='./images/gmail.png'
                className='w-6 mr-2 inline-block'
                alt='binary coders gmail'
              />{' '}
              <span className='underline decoration-1'> dpi.binarycoders@gmail.com</span>
            </li>
            <li>
              {' '}
              <img
                src='./images/phone.png'
                className='w-6 mr-2 inline-block'
                alt='binary coders contact'
              />{' '}
              Helpline : 018******67 , (Available : 10AM - 5PM)
            </li>
            <li>
              <img
                src='./images/locationWhite.png'
                className='w-6 mr-2 inline-block'
                alt='binary coders gmail '
              />{' '}
              Shahid Tajuddin Ahmed Sorony, Tejgaon Industrial Area, Dhaka - 1208
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer