import { Link } from '@remix-run/react'

export const BackButton = ({ to }: { to: string }) => {
  return (
    <div>
      <Link
        prefetch='intent'
        to={to}
        className='flex items-center my-4 font-semibold text-slate-700 hover:text-slate-800'
      >
        <span>
          <svg
            className='transform rotate-90'
            width='32'
            height='24'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M15.101 5.5V23.1094L9.40108 17.4095L8.14807 18.6619L15.9862 26.5L23.852 18.6342L22.5996 17.3817L16.8725 23.1094V5.5H15.101Z'
              fill='currentColor'
            ></path>
          </svg>
        </span>{' '}
        Back to Overview
      </Link>
    </div>
  )
}
