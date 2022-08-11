import { Link, useLocation } from '@remix-run/react'
import { blurImgUrl } from 'data/blur-img-url'
import bineryCodersLogo from '../../assets/logo.webp'
import BlurrableImage from '../blurable-img'
import FacebookIcon from '../icons/facebook'
import LightLocationIcon from '../icons/light-lication-icon'
import LinkedinLogo from '../icons/linkedin'
import MailIcon from '../icons/mail'
import PhoneIcon from '../icons/phone'
const FOOTER_HIDES_FROM = [
  '/auth/login',
  '/auth/register',
  '/auth/reset',
  '/auth/reset_password',
  '/auth/send-register-link',
]

const Footer = () => {
  const location = useLocation()

  const isFooterHide =
    location.pathname.startsWith('/python') || FOOTER_HIDES_FROM.includes(location.pathname)

  return (
    <footer className={`${isFooterHide ? 'hidden' : ''} py-16 footer-bg text-white`}>
      <div className='grid grid-cols-1 md:grid-cols-3 md:gap-4 px-5 md:px-16'>
        <div className=''>
          <BlurrableImage
            blurDataURl={blurImgUrl}
            className='h-12 w-60 relative'
            img={
              <img
                src={bineryCodersLogo}
                height='40'
                width='120'
                loading='lazy'
                className='h-12 hover:scale-105 object-cover w-auto transition duration-300 ease-in cursor-grab mb-4'
                alt='brand logo'
              />
            }
          />

          <div>
            <p className='text-white tracking-wide font-light'>
              A platform who tech and guid those student, who actually want learn programming . We
              believe that learning programming is nothing but fun
            </p>
          </div>
          <div className='flex items-center justify-start space-x-3 mt-8'>
            <a
              title='facebook'
              target='_blank'
              href='https://www.facebook.com/groups/binarycoders'
              rel='noreferrer'
            >
              <FacebookIcon className='text-sky-500' />
            </a>{' '}
            <a title='linkedin' href='https://www.facebook.com/groups/binarycoders'>
              <LinkedinLogo />
            </a>
          </div>
        </div>
        <div className=''>
          <h2 className='font-semibold md:mb-4 mb-3 mt-5'> Important Links</h2>
          <ul className='space-y-2'>
            <li>
              <Link
                prefetch='intent'
                className='font-light hover:text-sky-500 transition duration-300'
                to='/about'
              >
                Know more about us
              </Link>
            </li>
            <li>
              <Link
                prefetch='intent'
                className='font-light hover:text-sky-500 transition duration-300'
                to='/blog'
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                prefetch='intent'
                className='font-light hover:text-sky-500 transition duration-300'
                to='/question'
              >
                Ask Questions
              </Link>
            </li>
            <li>
              <Link
                prefetch='intent'
                className='font-light hover:text-sky-500 transition duration-300'
                to='/problems'
              >
                Solve Problems
              </Link>
            </li>
          </ul>
        </div>
        <div className=''>
          <h2 className='font-semibold md:mb-4 mb-3 mt-5'> Find Us </h2>
          <ul className='space-y-4 '>
            <li>
              <a
                href='https://mail.google.com/mail/u/2/#inbox?compose=DmwnWrRmTNqzxSflKkVHkfcllrvZvHkfGZwGDkWcFDHsWSFHKwNGFNdGFBdcGHRQXBDJjPzqWpKG'
                target='_blank'
                rel='noopener noreferrer'
                className='flex space-x-3 items-center'
              >
                <MailIcon />
                <span className='underline decoration-1 font-light'> Mail us for any query</span>
              </a>
            </li>
            <li className='flex items-center space-x-3 font-light'>
              <PhoneIcon />
              <span>Helpline : 018******67 , (Available : 10AM - 5PM)</span>
            </li>
            <li className='flex space-x-3 font-light'>
              <LightLocationIcon />
              <span>Shahid Tajuddin Ahmed Sorony, Tejgaon Industrial Area, Dhaka - 1208</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
