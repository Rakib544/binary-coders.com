import { Dialog } from '@reach/dialog'

import * as React from 'react'

interface ModalProps {
  email: string
  showDialog: boolean
  isReset?: boolean
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const SuccessModal = ({ email, showDialog, isReset, setShowDialog }: ModalProps): JSX.Element => {
  const close = () => setShowDialog(false)

  return (
    <div>
      <Dialog isOpen={showDialog} onDismiss={close} className='w-full'>
        <button className='close-button block text-right w-full focus:outline-none' onClick={close}>
          <span aria-hidden className='text-xl '>
            x
          </span>
        </button>
        <div className='text-center'>
          <h2 className='text-3xl font-medium test-slate-700'>
            {isReset ? 'Reset your password' : 'Verify your email'}
          </h2>
          <p className='my-4'>
            {isReset
              ? 'Check your mail to complete the reset password steps'
              : 'You will need to verify your email to complete registration'}
          </p>
          <img src='/images/login.webp' alt='img' className='h-32 block mx-auto' />
          <p className='my-4'>
            An email has been sent to <span className='text-blue-600'>{email}</span> with a link to
            {isReset ? 'reset your password' : 'complete your registration'}. If you have not
            received the email after a few minutes, please check, promotions, social or the spam
            folder
          </p>
        </div>
      </Dialog>
    </div>
  )
}

export default SuccessModal
