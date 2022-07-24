import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import CloseIcon from './icons/close-icon'

function NotificationMessage({
  queryStringKey,
  visibleMs = 8000,
  visible: controlledVisible,
  autoClose,
  children,
  position = 'bottom-right',
  delay = typeof controlledVisible === 'undefined' ? 1 : 0,
  background = 'bg-blue-500',
}: {
  queryStringKey?: string
  children?: React.ReactNode | React.ReactNode[]
  position?: 'bottom-right' | 'top-center' | 'bottom-left'
  visible?: boolean
  delay?: number
  background?: string
} & ({ autoClose: false; visibleMs?: never } | { visibleMs?: number; autoClose?: never })) {
  const [isVisible, setIsVisible] = React.useState(true)

  const initialY = position.includes('bottom') ? 50 : -50
  React.useEffect(() => {
    setIsVisible(true)
    const timeOut = setTimeout(() => {
      setIsVisible(false)
    }, 6000)

    return () => clearTimeout(timeOut)
  }, [])

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ y: initialY, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay } }}
          exit={{ y: initialY, opacity: 0 }}
          transition={{ ease: 'easeInOut', duration: 0.3 }}
          className={`pointer-events-none fixed left-0 right-0 z-50 px-5vw ${
            position === 'bottom-right' && 'bottom-8'
          } ${position === 'top-center' && 'top-8'} ${position === 'bottom-left' && 'bottom-8'}`}
        >
          <div
            className={`mx-auto flex w-full max-w-8xl ${
              position === 'bottom-right' && 'justify-end'
            } ${position === 'top-center' && 'justify-center'} ${
              position === 'bottom-left' && 'justify-start'
            }`}
          >
            <div
              className={`pointer-events-auto relative max-w-xl rounded-lg p-4 pr-14 shadow-xl shadow-sky-500/10 ${background} text-white`}
            >
              {children}
              {typeof controlledVisible === 'undefined' ? (
                <button
                  aria-label='dismiss message'
                  onClick={() => setIsVisible(false)}
                  className='text-slate-800 font-semibold hover:text-slate-800 focus:text-slate-800 absolute right-4 top-4'
                >
                  <CloseIcon />
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export { NotificationMessage }
