import { HeadersFunction, json, LoaderFunction } from '@remix-run/node'
import Plan from '~/components/ourPlan/plan'
import Stack from '~/components/stack/stack'
import Heading from '../components/heading/heading'
import OurTarget from '../components/ourTarget/ourTarget'

export const loader: LoaderFunction = () => {
  return json(null, {
    headers: {
      'Cache-Control': 'private, max-age=3600',
      Vary: 'Cookie',
    },
  })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-control': loaderHeaders.get('Cache-control'),
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
