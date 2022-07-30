import { MetaFunction } from '@remix-run/node'
import FacebookIcon from './icons/facebook'
import GitHubLogo from './icons/github'
import LinkedinLogo from './icons/linkedin'
import { teamData } from './temData'
export const meta: MetaFunction = () => {
  return {
    title: 'About - Binary Coders',
    description: 'About - Binary Coders',
    'og:title': 'About - Binary Coders',
    'og:type': 'website',
    'og:url': 'https://binary-coders.vercel.app/about',
    'og:description': 'About - Binary Coders',
    'og:image': 'https://i.ibb.co/P69y7fJ/thumbnail.png',
  }
}

const AboutMobile = () => {
  return (
    <>
      <div className='px-4 space-y-16'>
        {teamData.map((teamData, index) => (
          <div
            className='team-card-sm-device relative p-2 shadow-lg rounded-2xl ring ring-offset-1 ring-sky-500'
            key={index}
          >
            <img
              src={teamData.smImg}
              className='w-24 rounded-full absolute border ring-sky-500 ring ring-offset-1'
              style={{ top: '-25px', left: '-10px' }}
              alt={teamData.name}
            />
            <div className='card mt-24'>
              <h4
                className='absolute text-2xl font-bold'
                style={{ top: '28px', left: '110px', color: '#41485c' }}
              >
                {teamData.name}
              </h4>
              <p>{teamData.aboutText}</p>
              <div className='flex space-x-2 my-4 justify-center'>
                <a
                  className='bg-slate-50 transition duration-200 hover:shadow-blue-500/10 hover:shadow-md h-10 w-10 flex items-center justify-center rounded-full'
                  target='_blank'
                  rel='noreferrer'
                  href={teamData.facebook}
                >
                  <FacebookIcon color='#0ea5e9' />
                </a>
                <a
                  className='bg-slate-50 transition duration-200 hover:shadow-blue-500/10 hover:shadow-md h-10 w-10 flex items-center justify-center rounded-full'
                  target='_blank'
                  rel='noreferrer'
                  href={teamData.linkedin}
                >
                  <LinkedinLogo color='#0ea5e9' />
                </a>
                <a
                  className='bg-slate-50 transition duration-200 hover:shadow-blue-500/10 hover:shadow-md h-10 w-10 flex items-center justify-center rounded-full'
                  target='_blank'
                  rel='noreferrer'
                  href={teamData.github}
                >
                  <GitHubLogo color='#0ea5e9' />
                </a>
                <button className='block mx-auto px-8 sm:px-12 py-2 sm:py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'>
                  <a target='_blink' href={teamData.portfolio}>
                    View Profile
                  </a>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default AboutMobile
