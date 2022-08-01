import { Disclosure, Transition } from '@headlessui/react'
import { Link, useLocation } from '@remix-run/react'

type Topics = {
  title: string
  href: string
}

export default function DisCloserMenu({ topics, title }: { topics: Topics[]; title: string }) {
  const location = useLocation()
  return (
    <div className='w-full'>
      <div className='mx-auto w-full max-w-md rounded-2xl bg-white p-2'>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between rounded-lg bg-white-100 px-4 py-2 text-left text-md font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75 items-center'>
                <span>{title}</span>

                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                  className={`transition duration-300 ${
                    open ? 'rotate-180 transform' : ''
                  } h-4 w-4 text-slate-700`}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 15l7-7 7 7' />
                </svg>
              </Disclosure.Button>
              <Transition
                enter='transition duration-100 ease-out'
                enterFrom='transform opacity-0'
                enterTo='transform opacity-100'
                leave='transition duration-75 ease-out'
                leaveFrom='transform  opacity-100'
                leaveTo='transform  opacity-0'
              >
                <Disclosure.Panel className='px-4 pt-4 pb-2 text-lg text-gray-700'>
                  {topics?.map((topic: Topics) => (
                    <Link
                      key={topic.title}
                      to={`/python/${topic.href}`}
                      className={`block text-sm my-2 hover:text-sky-500 ${
                        location.pathname === `/python/${topic.href}`
                          ? 'text-sky-500 font-medium'
                          : ''
                      }`}
                    >
                      {topic.title}
                    </Link>
                  ))}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
