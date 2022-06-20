import { HeadersFunction, LoaderFunction } from '@remix-run/node'
import { json } from 'remix-utils'
import Plan from '~/components/ourPlan/plan'
import Stack from '~/components/stack/stack'
import Heading from '../components/heading/heading'
import OurTarget from '../components/ourTarget/ourTarget'

export const loader: LoaderFunction = () => {
  return json(null, {
    headers: {
      'Cache-control': `public, max-age=${60 * 5}, s-maxage=${60 * 60 * 24}`,
      Vary: 'Cookie',
    },
  })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-control': loaderHeaders.get('Cache-control') ?? '',
    Vary: loaderHeaders.get('Vary') ?? '',
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
