/* eslint-disable react/prop-types */
import { Dialog } from '@reach/dialog'
import { Link } from '@remix-run/react'
import moment from 'moment'

import * as React from 'react'
import { H6 } from './typography'

interface ModalProps {
  id: string
  slug: string
  viewedAt: string
  viewerId: string
  viewer: {
    username: string
    name: string
    profilePicture: string
  }
}

interface Props {
  viewers: ModalProps[]
  pageName: string
  showDialog: boolean
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewersModal = ({ viewers, pageName, showDialog, setShowDialog }: Props): JSX.Element => {
  // const [showDialog, setShowDialog] = React.useState(true)
  const close = () => setShowDialog(false)

  return (
    <div>
      <Dialog isOpen={showDialog} onDismiss={close} className='w-full'>
        <button className='close-button block text-right w-full focus:outline-none' onClick={close}>
          <span aria-hidden className='text-xl '>
            x
          </span>
        </button>
        <div>
          <H6 className='my-4'>People viewed this {pageName}.</H6>
          {viewers.map((viewer: ModalProps) => (
            <Link
              prefetch='intent'
              to={`/user/${viewer.viewer.username}`}
              key={viewer.viewer.username}
              className='my-4 w-full block'
            >
              <div className='flex items-center space-x-2'>
                <img
                  src={viewer.viewer.profilePicture}
                  alt={viewer.viewer.name}
                  className='h-16 rounded-xl w-14 object-cover'
                />
                <div>
                  <Link
                    className='text-sky-500 font-medium'
                    to={`/user/${viewer.viewer.username}`}
                    prefetch='intent'
                  >
                    {viewer.viewer.name}
                  </Link>
                  <small className='text-xs font-medium block'>
                    Viewed {moment(viewer.viewedAt).fromNow()}
                  </small>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Dialog>
    </div>
  )
}

export default ViewersModal
