import { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params.username)
  return null
}

const publicProfile = () => {
  return <div>This is public profile page.</div>
}

export default publicProfile
