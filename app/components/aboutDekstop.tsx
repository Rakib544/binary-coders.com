import { MetaFunction } from '@remix-run/node'
import { blurImgUrl } from 'data/blur-img-url'
import * as React from 'react'
import BlurrableImage from '~/components/blurable-img'
import FacebookIcon from '~/components/icons/facebook'
import GitHubLogo from '~/components/icons/github'
import LinkedinLogo from '~/components/icons/linkedin'
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

const AboutDesktop = () => {
  const [selectedMember, setSelectedMember] = React.useState(teamData[0])

  return (
    <>
      <div className='max-w-5xl m-auto p-5 md:grid md:grid-cols-2 justify-items-center content-center justify-self-center self-center'>
        <div>
          <h2 className='text-3xl font-bold my-6 meet-our-team-text mx-5 md:mx-0'>
            <span>
              {' '}
              <span className='butterfly'>
                <img src='./images/team/butterfly.webp' alt='' />
              </span>{' '}
              Meet
            </span>{' '}
            behind the binary coders. We love what we do.
          </h2>
          {teamData.map((teamDB, index) => (
            <div
              key={index}
              className={` p-5 grid grid-cols-10 gap-4 items-center cursor-pointer md:w-72 ${
                index === selectedMember.id ? 'shadow-blue-500/10 rounded-xl shadow-lg' : ''
              }`}
              onClick={() => setSelectedMember(teamData[index])}
            >
              <div className='col-span-3'>
                <BlurrableImage
                  blurDataURl={blurImgUrl}
                  className='h-16 w-16 rounded-full relative mx-auto'
                  img={
                    <img
                      src={index === selectedMember.id ? teamDB.img : './images/team/userEmpty.png'}
                      className={`rounded-full mr-8 h-16 w-16 object-cover ${
                        index === selectedMember.id ? 'ring-2 ring-offset-4 ring-sky-500' : ''
                      }`}
                      alt={teamDB.name}
                    />
                  }
                />
              </div>

              <div className='col-span-7'>
                <h2 className='tracking-wide uppercase font-bold text-gray-700'>{teamDB.name}</h2>
                <h6>{teamDB.role}</h6>
              </div>
            </div>
          ))}
        </div>
        <div className='px-0 md:px-14'>
          <div>
            <BlurrableImage
              key={selectedMember?.img}
              blurDataURl={blurImgUrl}
              className='h-96 w-auto relative mt-12 mx-auto'
              img={
                <img
                  className='rounded-xl h-96 object-cover w-full'
                  // width='100%'
                  src={selectedMember.img}
                  alt={selectedMember.name}
                />
              }
            />
          </div>
          <div className='mt-4'>
            <p>{selectedMember.aboutText}</p>
          </div>
          <div className='flex space-x-2 my-4 justify-center'>
            <a
              className='bg-slate-50 transition duration-200 hover:shadow-blue-500/10 hover:shadow-md h-10 w-10 flex items-center justify-center rounded-full'
              target='_blank'
              rel='noreferrer'
              href={selectedMember.facebook}
            >
              <FacebookIcon color='#0ea5e9' />
            </a>
            <a
              className='bg-slate-50 transition duration-200 hover:shadow-blue-500/10 hover:shadow-md h-10 w-10 flex items-center justify-center rounded-full'
              target='_blank'
              rel='noreferrer'
              href={selectedMember.linkedin}
            >
              <LinkedinLogo color='#0ea5e9' />
            </a>
            <a
              className='bg-slate-50 transition duration-200 hover:shadow-blue-500/10 hover:shadow-md h-10 w-10 flex items-center justify-center rounded-full'
              target='_blank'
              rel='noreferrer'
              href={selectedMember.github}
            >
              <GitHubLogo color='#0ea5e9' />
            </a>
            <button className='block mx-auto px-8 sm:px-12 py-2 sm:py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'>
              <a target='_blink' href={selectedMember.portfolio}>
                View Profile
              </a>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutDesktop
