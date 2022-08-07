import { Dialog, Transition } from '@headlessui/react'
import { Link } from '@remix-run/react'
import {
  FLOW_CONTROL_TOPICS,
  PYTHON_DATATYPES_TOPICS,
  PYTHON_FUNCTION_TOPICS,
  PYTHON_INTRODUCTION_TOPICS,
} from 'data/python-topics'
import { Fragment, useState } from 'react'
import DisCloserMenu from './disclouser'
import CloseIcon from './icons/close-icon'

export default function PythonMenuSideBar({ role }: { role: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <span onClick={() => setOpen(true)} className='cursor-pointer'>
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M5.3335 4H14.0002'
            stroke='#25265E'
            strokeOpacity='0.8'
            strokeWidth='1.33333'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
          <path
            d='M5.3335 8H14.0002'
            stroke='#25265E'
            strokeOpacity='0.8'
            strokeWidth='1.33333'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
          <path
            d='M5.3335 12H14.0002'
            stroke='#25265E'
            strokeOpacity='0.8'
            strokeWidth='1.33333'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
          <path
            d='M2.6665 4H1.99984'
            stroke='#25265E'
            strokeOpacity='0.8'
            strokeWidth='1.33333'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
          <path
            d='M2.6665 8H1.99984'
            stroke='#25265E'
            strokeOpacity='0.8'
            strokeWidth='1.33333'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
          <path
            d='M2.6665 12H1.99984'
            stroke='#25265E'
            strokeOpacity='0.8'
            strokeWidth='1.33333'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
        </svg>
      </span>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-in-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in-out duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto relative w-screen max-w-md'>
                    <Transition.Child
                      as={Fragment}
                      enter='ease-in-out duration-500'
                      enterFrom='opacity-0'
                      enterTo='opacity-100'
                      leave='ease-in-out duration-500'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <div className='absolute top-0 right-4 ml-8 flex pt-4 pl-2 sm:-ml-10 sm:pr-4'>
                        <button
                          type='button'
                          className='rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
                          onClick={() => setOpen(false)}
                        >
                          <span className='sr-only'>Close panel</span>
                          <CloseIcon />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className='flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <Dialog.Title className='text-xl ml-4 font-medium text-gray-900'>
                          Learn Python Programming
                        </Dialog.Title>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        {role === 'admin' && (
                          <Link
                            to='/python-programming/create-topic'
                            className='block mx-2 px-4 py-3 rounded-lg text-center text-white text-sm font-medium bg-sky-500 mb-4'
                          >
                            Add Topic
                          </Link>
                        )}
                        <DisCloserMenu
                          topics={PYTHON_INTRODUCTION_TOPICS}
                          title='Python Introduction'
                        />
                        <DisCloserMenu topics={FLOW_CONTROL_TOPICS} title='Python Flow Control' />
                        <DisCloserMenu topics={PYTHON_FUNCTION_TOPICS} title='Python Function' />
                        <DisCloserMenu topics={PYTHON_DATATYPES_TOPICS} title='Python Data Types' />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
