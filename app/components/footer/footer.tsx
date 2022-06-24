import { Link, useLocation } from '@remix-run/react'
import FacebookIcon from '../icons/facebook'
import InstagramIcon from '../icons/instagram'
import LinkedinLogo from '../icons/linkedin'
import LocationIcon from '../icons/location'
import MailIcon from '../icons/mail'
import PhoneIcon from '../icons/phone'
import YoutubeIcon from '../icons/youtube'
import { Paragraph } from '../typography'
const FOOTER_HIDES_FROM = [
  '/auth/login',
  '/auth/register',
  '/auth/reset',
  '/auth/reset_password',
  '/auth/send-register-link',
]

const Footer = () => {
  const location = useLocation()
  const isFooterHide = FOOTER_HIDES_FROM.includes(location.pathname)

  return (
    <footer className={`${isFooterHide ? 'hidden' : ''} py-16 footer-bg text-white`}>
      <div className='grid grid-cols-1 md:grid-cols-3 md:gap-4 px-5 md:px-16'>
        <div className=''>
          <img
            src='https://i.ibb.co/KX9YN7Z/logo-01.png'
            className='h-16 hover:scale-105 transition duration-300 ease-in cursor-grab mb-6'
            alt='brand logo'
          />
          <div>
            <Paragraph className='text-left' textColorClassName='text-white text-sm tracking-wide'>
              A platform who tech and guid those student, who actually want learn programming . We
              believe that learning programming is nothing but fun
            </Paragraph>
          </div>
          <div className='flex items-center justify-start space-x-3 mt-8'>
            <a target='_blank' href='https://www.facebook.com/groups/binarycoders' rel='noreferrer'>
              <FacebookIcon />
            </a>{' '}
            <a href='https://www.facebook.com/groups/binarycoders'>
              <InstagramIcon />
            </a>
            <a href='https://www.facebook.com/groups/binarycoders'>
              <LinkedinLogo />
            </a>
            <a href='https://www.facebook.com/groups/binarycoders'>
              <YoutubeIcon />
            </a>
          </div>
        </div>
        <div className=''>
          <h2 className='font-semibold md:mb-8 mb-3 mt-5'>
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
          <h2 className='font-semibold md:mb-8 mb-3 mt-5'> Find Us </h2>
          <ul className='space-y-4 '>
            <li>
              <a
                href='https://mail.google.com/mail/u/2/#inbox?compose=DmwnWrRmTNqzxSflKkVHkfcllrvZvHkfGZwGDkWcFDHsWSFHKwNGFNdGFBdcGHRQXBDJjPzqWpKG'
                target='_blank'
                rel='noopener noreferrer'
                className='flex space-x-3 items-center'
              >
                <MailIcon />
                <span className='underline decoration-1'> Mail us for any query</span>
              </a>
            </li>
            <li className='flex items-center space-x-3'>
              <PhoneIcon />
              <span>Helpline : 018******67 , (Available : 10AM - 5PM)</span>
            </li>
            <li className='flex space-x-3'>
              <LocationIcon />
              <span>Shahid Tajuddin Ahmed Sorony, Tejgaon Industrial Area, Dhaka - 1208</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
