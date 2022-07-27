import { Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'
import * as React from 'react'
import CloseIcon from './icons/close-icon'
import Quill from './quill.client'

const ReplyModal = ({
  onClose,
  createReply,
}: {
  onClose: () => void
  createReply: (reply: string) => void
}) => {
  const [html, setHtml] = React.useState<string>()
  const [error, setError] = React.useState<boolean>(false)

  const handleCreateReply = () => {
    setError(false)
    if ((html as string)?.toString()?.trim()?.length > 0) {
      createReply(html as string)
      onClose()
    } else {
      setError(true)
    }
  }
  return (
    <Dialog
      className='fixed md:inset-x-1/4 bottom-0 h-2/3 md:h-96 w-full md:w-2/3 z-10'
      onClose={onClose}
      open={true}
    >
      <div className='flex flex-col justify-center h-full px-1 pt-4 text-center sm:block sm:p-0'>
        <Dialog.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] },
          }}
          className='fixed inset-0 bg-black/40'
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{
            y: 0,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] },
          }}
          exit={{
            y: '100%',
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] },
          }}
          className='z-0 flex flex-col w-full h-full bg-white rounded-t-lg shadow-xl'
        >
          <div className='flex justify-between p-2 md:p-4 '>
            <h3 className='flex items-center'>
              <svg
                height='16px'
                viewBox='0 0 16 16'
                width='16px'
                className='mr-2 fill-current text-grey-800'
                data-v-2836fdb5-s=''
              >
                <g
                  fill='none'
                  fillRule='evenodd'
                  stroke='none'
                  strokeWidth='1'
                  data-v-2836fdb5-s=''
                >
                  <g
                    id='Group'
                    className='fill-current'
                    transform='translate(0.000000, -336.000000)'
                    data-v-2836fdb5-s=''
                  >
                    <path
                      d='M0,344 L6,339 L6,342 C10.5,342 14,343 16,348 C13,345.5 10,345 6,346 L6,349 L0,344 L0,344 Z M0,344'
                      data-v-2836fdb5-s=''
                    ></path>
                  </g>
                </g>
              </svg>
              <span className='font-semibold text-sm'>
                Reply to <span className='text-sky-500'>Comment</span>
              </span>
            </h3>
            <span className='cursor-pointer' onClick={onClose}>
              <CloseIcon />
            </span>
          </div>
          {error && <p className='text-red-500 text-xs'>Reply can&apos;t be empty</p>}
          <div className='px-4 py-0'>
            <Quill
              defaultValue='<p></p>'
              setHtml={setHtml}
              env='rvjndjbnbkjfngbjgnfkbjngfkj'
              height='120px'
            />
          </div>
          <div className='flex space-x-4 px-4 justify-center md:justify-end text-white '>
            <button
              className='px-8 sm:px-12 py-2 sm:py-3 outline-none  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block my-4'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className='px-8 sm:px-12 py-2 sm:py-3 outline-none  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block my-4'
              onClick={handleCreateReply}
            >
              Comment
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  )
}

export default ReplyModal
