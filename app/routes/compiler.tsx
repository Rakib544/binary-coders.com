import { HeadersFunction, MetaFunction } from '@remix-run/node'

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24 * 30}`,
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Practice Programming - Binary Coders',
    description: 'Practice your basic programming fundamentals',
  }
}

const compiler = () => {
  return (
    <div>
      <h1 className='text-2xl text-center'>
        <iframe
          frameBorder='0'
          height='450px'
          src='https://onecompiler.com/embed/python'
          width='100%'
          // hideNew={true as boolean}
        ></iframe>
      </h1>
    </div>
  )
}

export default compiler
