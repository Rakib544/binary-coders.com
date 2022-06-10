import { Dialog } from '@reach/dialog'

import * as React from 'react'

interface ModalProps {
  email: string
}

const SuccessModal = ({ email = '' }: ModalProps): JSX.Element => {
  const [showDialog, setShowDialog] = React.useState(false)
  const close = () => setShowDialog(false)
  React.useEffect(() => {
    if (email.length > 0) {
      setShowDialog(true)
    } else {
      setShowDialog(false)
    }
  }, [email.length])
  return (
    <div>
      <Dialog isOpen={showDialog} onDismiss={close} className='w-full'>
        <button className='close-button block text-right w-full focus:outline-none' onClick={close}>
          <span aria-hidden className='text-xl '>
            x
          </span>
        </button>
        <div className='text-center'>
          <h2 className='text-3xl font-medium test-slate-700'>Verify your email</h2>
          <p className='my-4'>You will need to verify your email to complete registration</p>
          <img src='/images/login.png' alt='img' className='h-32 block mx-auto' />
          <p className='my-4'>
            An email has been sent to <span className='text-blue-600'>{email}</span> with a link to
            verify your account. If you have not received the email after a few minutes, please
            check the spam folder
          </p>
        </div>
      </Dialog>
    </div>
  )
}

export default SuccessModal
