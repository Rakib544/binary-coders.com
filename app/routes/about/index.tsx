import { MetaFunction } from '@remix-run/node'
import { blurImgUrl } from 'data/blur-img-url'
import * as React from 'react'
import BlurrableImage from '~/components/blurable-img'
import FacebookIcon from '~/components/icons/facebook'
import GitHubLogo from '~/components/icons/github'
import LinkedinLogo from '~/components/icons/linkedin'
import WhyWeAre from '~/components/whyweare'
export type teamMemberData = {
  id: number
  name: string
  role: string
  portfolio: string
  img: string
  aboutText: string
  facebook: string
  linkedin: string
  github: string
}[]

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

const teamData: teamMemberData = [
  {
    id: 0,
    name: 'Rakib',
    role: 'web developer',
    portfolio: 'https://rakib-seven.vercel.app/',
    img: './images/team/rakib.webp',
    aboutText:
      'Hello I am Rakib, Frontend Developer I am a Javascript Developer that focuses on frontend framework such as React. I am passion for Web Accessibility, Design System, Web security etc.',
    facebook: 'https://www.facebook.com/profile.php?id=100018966190023',
    linkedin: 'https://www.linkedin.com/in/dev-rakib/',
    github: 'https://github.com/Rakib544',
  },
  {
    id: 1,
    name: 'Tanvir Hossain',
    role: 'web developer',
    portfolio: 'https://prothfolioweb.web.app/',
    img: '/images/team/tanvir.webp',
    aboutText:
      'Hello, I am Tanvir, Frontend Developer, I love to do all of the web things with javaScript.I am passionate about Web Design, Web Develop, and Backend with node.js. Currently, I am working with React js which is the most popular framework for JavaScript',
    facebook: 'https://facebook.com/tanvir1017',
    linkedin: 'https://www.linkedin.com/in/tanvir1017/',
    github: 'https://github.com/tanvir1017',
  },
  {
    id: 2,
    name: 'Abu Jakaria',
    role: 'web developer',
    portfolio: 'https://abujakaria-cse.web.app/',
    img: '/images/team/abuJakariya.jpg',
    aboutText:
      'Im Abu Jakaria, a highly skilled developer with strong confidence with quality and high performance web applications seeks the rules of Junior Software Developer at Javascript, React, Express JS and modern Javascript libraries.',
    facebook: 'https://www.facebook.com/abujakariacse',
    linkedin: 'https://www.linkedin.com/in/abujakariacse/',
    github: 'https://github.com/abujakariacse',
  },
  {
    id: 3,
    name: 'UK Proloy',
    role: 'web developer',
    portfolio: '',
    img: '/images/team/proloy.webp',
    aboutText:
      'Im Utsha and I Know Some Interesting Tecnology which is based javascript called React. I am a passionate Front End Developer with knowing some famous frameworks. I love working on chanllenging projects with learning something new and writting clean code. I want to retain and enhance my skills by working at an Institute. My keen interest in learning new technology',
    facebook: 'https://www.facebook.com/ukp.proloy',
    linkedin: 'https://www.linkedin.com/in/utsha-kumar-paul/',
    github: 'https://github.com/proloypaul',
  },
]
const index = () => {
  const [selectedMember, setSelectedMember] = React.useState(teamData[0])

  return (
    <>
      <WhyWeAre />
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
              className={` p-5 flex justify-center items-center cursor-pointer md:w-72 ${
                index === selectedMember.id ? 'shadow-blue-500/10 rounded-xl shadow-lg' : ''
              }`}
              onClick={() => setSelectedMember(teamData[index])}
            >
              <img
                src={index === selectedMember.id ? teamDB.img : './images/team/userEmpty.png'}
                className={`rounded-full mr-8 h-16 w-16 object-cover ${
                  index === selectedMember.id ? 'ring-2 ring-offset-4 ring-blue-600' : ''
                }`}
                alt={teamDB.name}
              />

              <div>
                <h2 className='tracking-wide uppercase font-bold text-gray-700'>{teamDB.name}</h2>
                <h6>{teamDB.role}</h6>
              </div>
            </div>
          ))}
        </div>
        <div className='px-0 md:px-14'>
          <div>
            <BlurrableImage
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
          <div className=''>
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
          </div>
          <button className='block mx-auto px-8 sm:px-12 py-2 sm:py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50'>
            <a target='_blink' href={selectedMember.portfolio}>
              View Profile
            </a>
          </button>
        </div>
      </div>
    </>
  )
}

export default index
