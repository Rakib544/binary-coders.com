import { Link, useFetcher } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import moment from 'moment'
import * as React from 'react'
import ReplyModal from './reply-modal'

type Answer = {
  answer: {
    id: string
    answerCreatorId: string
    answeredBy: string
    answeredTime: string
    answer: string
    slug: string
    totalReplies: number
    creator: {
      profilePicture: string
      name: string
      username: string
    }
  }
  userId: string | null
}

type Reply = {
  id: string
  replyTime: string
  mainAnswerId: string
  answer: string
  creator: {
    username: string
    name: string
    profilePicture: string
  }
  replyCreatorId: string
}

const Reply = ({ answer, userId }: Answer) => {
  const [openReplyModal, setOpenReplyModal] = React.useState(false)
  const [showRepliesAction, setShowRepliesAction] = React.useState(true)

  const fetcher = useFetcher()
  const handleCreateReply = (reply: string) => {
    fetcher.submit({ action: 'reply', reply: reply, mainAnswerId: answer?.id }, { method: 'post' })
    setShowRepliesAction(false)
  }

  const handleLoadComments = (mainAnswerId: string) => {
    fetcher.submit({ action: 'loadReply', mainAnswerId: mainAnswerId }, { method: 'post' })
    setShowRepliesAction(false)
  }

  return (
    <div className='p-4  my-4 border-b border-slate-200 last:border-none'>
      <div>
        <div className='flex items-center space-x-2 mb-2'>
          <img
            src={answer.creator.profilePicture}
            alt={answer.creator.name}
            className='h-12 w-12 rounded-lg object-cover'
          />
          <div>
            <p className='font-medium text-slate-700 text-sm block'>{answer.creator.name}</p>
            <small className='font-medium text-slate-500'>
              <Link
                prefetch='intent'
                to={`/user/${answer.creator.username}`}
                className='text-sky-500'
              >
                @{answer.creator.username}
              </Link>{' '}
              answered {moment(answer.answeredTime).fromNow()}
            </small>
          </div>
        </div>
        <div className='ml-14'>
          <div
            dangerouslySetInnerHTML={{ __html: answer.answer }}
            className='prose prose-slate lg:prose-md max-w-none prose-a:text-blue-600'
          />
          {userId && (
            <button
              onClick={() => setOpenReplyModal(true)}
              className='py-2 px-6 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold hover:ring-1 hover:ring-sky-500 mt-2'
            >
              Reply
            </button>
          )}
          {showRepliesAction && (
            <>
              {answer.totalReplies > 0 && (
                <div className='mt-4'>
                  <button
                    onClick={() => handleLoadComments(answer.id)}
                    className='flex items-center space-x-1'
                  >
                    <svg
                      stroke='currentColor'
                      fill='none'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <polyline points='15 10 20 15 15 20'></polyline>
                      <path d='M4 4v7a4 4 0 0 0 4 4h12'></path>
                    </svg>

                    <span className='text-xs font-medium'>{answer.totalReplies} Replies</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {fetcher?.data?.replies?.map((reply: Reply) => (
          <div
            key={reply?.id}
            className='my-4 border-b border-slate-200 ml-14 py-4 last:border-none'
          >
            <div className='flex space-x-2'>
              <div>
                <img
                  src={reply?.creator?.profilePicture}
                  alt={reply?.creator?.name}
                  className='h-10 w-10 rounded-lg object-cover'
                />
              </div>
              <div>
                <p className='font-medium text-slate-700 text-sm block'>{reply?.creator?.name}</p>
                <small className='font-medium text-slate-500'>
                  <Link
                    prefetch='intent'
                    to={`/user/${reply?.creator?.username}`}
                    className='text-sky-500'
                  >
                    @{reply?.creator?.username}
                  </Link>{' '}
                  replied {moment(reply?.replyTime).fromNow()}
                </small>
              </div>
            </div>
            <div className='ml-12'>
              <div
                dangerouslySetInnerHTML={{ __html: reply?.answer }}
                className='prose prose-slate lg:prose-md max-w-none prose-a:text-blue-600'
              />
            </div>
          </div>
        ))}
      </div>
      {fetcher.state !== 'idle' && <p>Loading...</p>}
      <AnimatePresence>
        {openReplyModal && (
          <ReplyModal onClose={() => setOpenReplyModal(false)} createReply={handleCreateReply} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Reply
