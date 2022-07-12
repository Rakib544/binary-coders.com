import * as React from 'react'
import OurMission from './ourMission'
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
  instagram: string
}[]
const teamData: teamMemberData = [
  {
    id: 0,
    name: 'MD Rakib',
    role: 'web developer',
    portfolio: 'https://rakib-seven.vercel.app/',
    img: './images/team/rakib.webp',
    aboutText:
      'Hello I am Rakib, Frontend Developer I am a Javascript Developer that focuses on frontend framework such as React. I am passion for Web Accessibility, Design System, Web security etc.',
    facebook: 'https://www.facebook.com/profile.php?id=100018966190023',
    linkedin: 'https://www.linkedin.com/in/dev-rakib/',
    github: 'https://github.com/Rakib544',
    instagram: 'https://www.facebook.com/profile.php?id=100018966190023',
  },
  {
    id: 1,
    name: 'Tanvir Hossain',
    role: 'web developer',
    portfolio: 'https://prothfolioweb.web.app/',
    img: './images/team/tanvir.webp',
    aboutText:
      'Hello, I am Tanvir, Frontend Developer, I love to do all of the web things with javaScript.I am passionate about Web Design, Web Develop, and Backend with node.js. Currently, I am working with React js which is the most popular framework for JavaScript',
    facebook: 'https://facebook.com/tanvir1017',
    linkedin: 'https://linked.com/tanvir1017',
    github: 'https://github.com/tanvir1017',
    instagram: 'https://www.instagram.com/mdtan_vir037/',
  },
  {
    id: 2,
    name: 'Abu Jakariya',
    role: 'web developer',
    portfolio: 'https://abujakaria-cse.web.app/',
    img: './images/team/abuJakariya.webp',
    aboutText:
      'Im Abu Jakaria, a highly skilled developer with strong confidence with quality and high performance web applications seeks the rules of Junior Software Developer at Javascript, React, Express JS and modern Javascript libraries.',
    facebook: 'https://www.facebook.com/abujakariacse',
    linkedin: 'https://linkedin.com/abujakariacse',
    github: 'https://github.com/abujakariacse',
    instagram: 'https://instagram.com/abujakariacse',
  },
  {
    id: 3,
    name: 'UK Proloy',
    role: 'web developer',
    portfolio: '',
    img: './images/team/proloy.webp',
    aboutText:
      'Im Utsho kumer proloy, a highly skilled developer with strong confidence with quality and high performance web applications seeks the rules of Junior Software Developer at Javascript, React, Express JS and modern Javascript libraries.',
    facebook: 'https://www.facebook.com/ukp.proloy',
    linkedin: 'https://www.facebook.com/ukp.proloy',
    github: 'https://github.com/proloypaul',
    instagram: 'https://www.facebook.com/ukp.proloy',
  },
]
const index = () => {
  const [selectedMember, setSelectedMember] = React.useState(teamData[0])

  return (
    <>
      <OurMission />
      <div className='max-w-5xl m-auto p-5 md:grid md:grid-cols-2 justify-items-center content-center justify-self-center self-center'>
        <div>
          <h2 className='text-3xl font-bold my-6 meet-our-team-text'>
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
                index === selectedMember.id ? 'shadow-lg' : ''
              }`}
              onClick={() => setSelectedMember(teamData[index])}
            >
              <img
                src={index === selectedMember.id ? teamDB.img : './images/team/userEmpty.png'}
                className={`w-16 rounded-full mr-8 ${
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
        <div className='md:mt-0 mt-5 md:ml-12'>
          <div>
            <div className='dev-image'>
              <div className='social-link'>
                <p className='my-4 rounded bg-sky-400/20 px-2 py-4 text-xs font-medium uppercase text-sky-500 rotate-90'>
                  Follow Me →
                </p>
                <div className='social-link-span flex flex-col space-y-4'>
                  <a target='_blink' href={selectedMember.facebook}>
                    <i className='fa-brands fa-facebook-f  mr-8 border p-3 rounded-full   cursor-pointer'></i>
                  </a>
                  <a target='_blink' href={selectedMember.instagram}>
                    <i className='fa-brands fa-instagram  mr-8 border p-3 rounded-full  cursor-pointer'></i>
                  </a>
                  <a target='_blink' href={selectedMember.linkedin}>
                    <i className='fa-brands fa-linkedin-in mr-8 border p-3 rounded-full  cursor-pointer'></i>
                  </a>
                  <a target='_blink' href={selectedMember.github}>
                    <i className='fa-brands fa-github  mr-8 border p-3 rounded-full  cursor-pointer'></i>
                  </a>
                </div>
              </div>
              <span className='span1'></span>
              <img
                className=' ring-2 ring-offset-4 ring-blue-600'
                width='90%'
                src={selectedMember.img}
                alt={selectedMember.name}
              />
              <span className='span2'></span>
            </div>
            <p className='my-5'>{selectedMember.aboutText}</p>
            <button className='px-8 sm:px-12 py-2 sm:py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200 shadow-blue-500/50 inline-block'>
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

export default index
