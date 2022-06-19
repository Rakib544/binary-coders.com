import { HeadersFunction, LoaderFunction } from '@remix-run/node'
import Plan from '~/components/ourPlan/plan'
import Stack from '~/components/stack/stack'
import Heading from '../components/heading/heading'
import OurTarget from '../components/ourTarget/ourTarget'

export const loader: LoaderFunction = () => {
  return null
}

export const headers: HeadersFunction = () => {
  return {
    'Cache-control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24 * 30}`,
  }
}

export default function Index() {
  return (
    <>
      <Heading />
      <OurTarget />
      <Plan />
      <Stack />
    </>
  )
}
