import AboutDesktop from '~/components/aboutDekstop'
import AboutMobile from '~/components/aboutMobile'
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

const index = () => {
  return (
    <>
      <WhyWeAre />
      <div className='px-3 md:mb-0 mb-16 md:hidden block'>
        <h2 className='text-3xl font-bold my-6 meet-our-team-text mx-5 md:mx-0'>
          <span>
            {' '}
            <span className='butterfly'>
              <img src='./images/team/butterfly.webp' alt='butterfly' />
            </span>{' '}
            Meet
          </span>{' '}
          behind the binary coders. We love what we do.
        </h2>
      </div>
      <div className='hidden md:block'>
        <AboutDesktop />
      </div>
      <div className='md:hidden block mb-12'>
        <AboutMobile />
      </div>
    </>
  )
}

export default index
