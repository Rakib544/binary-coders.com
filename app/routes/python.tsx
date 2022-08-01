import { redirect } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const loader = async () => {
  return redirect('/python/getting-started')
}

const PYTHON_TOPICS = [
  {
    title: 'Getting Started',
    href: 'getting-started',
  },
  {
    title: 'Keywords and Identifiers',
    href: 'keywords-and-identifiers',
  },
  {
    title: 'Statements and Comments',
    href: 'statements-and-comments',
  },
]

const PythonTutorial = () => {
  return (
    <div className='grid grid-cols-12 gap-4'>
      <aside className='col-span-2'>
        {PYTHON_TOPICS.map((topic) => (
          <Link key={topic.title} to={`/python/${topic.href}`} className='block'>
            {topic.title}
          </Link>
        ))}
      </aside>
      <div className='col-span-10'>
        <h2>Welcome to python programming</h2>
      </div>
    </div>
  )
}

export default PythonTutorial
