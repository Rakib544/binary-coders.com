import AdvantageBinaryCoders from '~/components/advantageBinaryCoders/advantageBinaryCoders'
import Plan from '~/components/ourPlan/plan'
import Quote from '~/components/quote/quote'
import Stack from '~/components/stack/stack'
import Heading from '../components/heading/heading'
import OurTarget from '../components/ourTarget/ourTarget'

export default function Index() {
  return (
    <>
      <Heading />
      <OurTarget />
      <Plan />
      <Stack />
      <Quote />
      <AdvantageBinaryCoders />
    </>
  )
}

export function ErrorBoundary() {
  return (
    <div className='justify-center h-96 flex items-center'>
      <div className='text-center'>
        {' '}
        <h1 className='text-3xl font-medium'>Ooops.</h1>
        <p>Something unexpected went wrong. Sorry about that.</p>
        <button
          className='px-8 sm:px-12 py-2 sm:py-3  bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 my-6'
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
