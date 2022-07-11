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
