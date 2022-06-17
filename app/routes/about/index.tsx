import Feature from '~/components/feature/feature'
import GitHubLogo from '~/components/icons/github'
import LinkedinLogo from '~/components/icons/linkedin'

const index = () => {
  return (
    <div className='mx-8 my-12'>
      <div className='text-center text-3xl font-bold'>
        <h1>Student-First Initiative</h1>
        <h1 className='text-blue-600'> for Lower Rates on</h1>
        <h1 className='text-blue-600'>Student Loans,</h1>
      </div>
      <div className='flex justify-center items-center py-8'>
        <div className='lg:flex '>
          <img
            src='https://i.ibb.co/mvg4qXt/csaba-balazs-q9-URsedw330-unsplash.jpg'
            alt='Empty'
            className=' lg:p-2  lg:w-80 lg:h-80'
          />
          <div className='lg:flex-none'>
            <img
              src='https://i.ibb.co/mvg4qXt/csaba-balazs-q9-URsedw330-unsplash.jpg'
              alt='Empty'
              className=' sm:w-40 lg:py-2 lg:w-40 lg:h-40'
            />
            <img
              src='https://i.ibb.co/mvg4qXt/csaba-balazs-q9-URsedw330-unsplash.jpg'
              alt='Empty'
              className=' sm:w-40 lg:pb-2 lg:w-40 lg:h-40'
            />
          </div>
          <img
            src='https://i.ibb.co/mvg4qXt/csaba-balazs-q9-URsedw330-unsplash.jpg'
            alt='Empty'
            className='lg:p-2 lg:w-80 lg:h-80'
          />
        </div>
      </div>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>
          Our <span className='text-blue-600'>story</span>
        </h1>
        <div className='py-4'>
          <p>
            <span className='text-blue-400 font-bold'>BinaryCoders</span> founder,{' '}
            <span className='font-bold'>Abu Jakaria</span>. He is the first person
          </p>
          <p>Who think we can build a programmer Group.</p>
          <p>
            This web page develop idea! come from <span className='font-bold'>Rakib Hossain</span>.
          </p>
          <p>
            {' '}
            He also developed our <span className='text-blue-400 font-bold'>BinaryCoders</span>{' '}
            website.
          </p>
          <p>
            And don&apos;t forgate about <span className='font-bold'>Tanvir Hossain</span>.
          </p>
          <p>
            Who give&apos;s us how to improve our{' '}
            <span className='text-blue-400 font-bold'>BinaryCoders</span>.
          </p>
          <p>
            Now we are able to create <span className='text-blue-400 font-bold'>BinaryCoders</span>{' '}
            with joy.
          </p>
        </div>
      </div>
      {/* Our feature */}

      <div className='py-12'>
        <div className='grid sm:grid-cols-2 lg:grid-cols-2 gap-4'>
          <div>
            <h1 className='text-4xl font-bold'>
              Our <span className='text-blue-600'>feature</span>
            </h1>
          </div>
          <div>
            <Feature />
          </div>
        </div>
      </div>
      {/* our team  */}
      <div>
        <h1 className='text-4xl font-bold'>
          Our <span className='text-blue-600'>team</span>
        </h1>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 py-12 text-center'>
          <div className='p-4'>
            <img
              src='https://i.ibb.co/HGqL3r3/instructor-img-3-8e53fa9c4173331fb350.jpg'
              alt='Empty'
              className='w-full'
            />
            <div className='py-4 text-center w-full'>
              <h1 className='text-3xl font-bold'>Rakib Hossain</h1>
              <p className='py-2 text-xl font-medium text-blue-600'>Programmer</p>
              <p className='text-slate-500'>
                BinaryCodes founder, Abu Jakaria. He is the first personWho think we can build a
                programmer Group.This web page develop idea! come from Rakib Hossain.
              </p>
              <div className='flex justify-around py-4'>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <GitHubLogo />
                  </p>
                </div>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <LinkedinLogo />
                  </p>
                </div>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <GitHubLogo />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <img
              src='https://i.ibb.co/HGqL3r3/instructor-img-3-8e53fa9c4173331fb350.jpg'
              alt='Empty'
              className='w-full'
            />
            <div className='py-4 text-center w-full'>
              <h1 className='text-3xl font-bold'>Tanvir Hossain</h1>
              <p className='py-2 text-xl font-medium text-blue-600'>Programmer</p>
              <p className='text-slate-500'>
                BinaryCodes founder, Abu Jakaria. He is the first personWho think we can build a
                programmer Group.This web page develop idea! come from Rakib Hossain.
              </p>
              <div className='flex justify-around py-4'>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <GitHubLogo />
                  </p>
                </div>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <LinkedinLogo />
                  </p>
                </div>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <GitHubLogo />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <img
              src='https://i.ibb.co/HGqL3r3/instructor-img-3-8e53fa9c4173331fb350.jpg'
              alt='Empty'
              className='w-full'
            />
            <div className='py-4 text-center w-full'>
              <h1 className='text-3xl font-bold'>Abu Jakariya</h1>
              <p className='py-2 text-xl font-medium text-blue-600'>Programmer</p>
              <p className='text-slate-500'>
                BinaryCodes founder, Abu Jakaria. He is the first personWho think we can build a
                programmer Group.This web page develop idea! come from Rakib Hossain.
              </p>
              <div className='flex justify-around py-4'>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <GitHubLogo />
                  </p>
                </div>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <LinkedinLogo />
                  </p>
                </div>
                <div>
                  <p className='p-4 bg-black text-white border-0 rounded-full'>
                    <GitHubLogo />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className='py-12'>
        {/* <h1 className='text-3xl font-bold'>Our values</h1> */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <h1 className='text-4xl font-bold'>
              Our <span className='text-blue-600'>values</span>
            </h1>
          </div>
          <div></div>
          <div>
            <div className='flex justify-start items-center pt-8'>
              <img src='https://i.ibb.co/Xx3dh0P/images.jpg' alt='Empty!' className='w-28' />
            </div>
            <div className='flex justify-start items-center pt-10'>
              <img
                src='https://i.ibb.co/G0ksmLJ/egg-illustration-cartoon-holding-smartphone-cute-style-t-shirt-sticker-logo-element-152558-3403.webp'
                alt='Empty!'
                className='w-40'
              />
            </div>
            <div className='flex justify-start items-center pt-12'>
              <img
                src='https://i.ibb.co/Qfy0yqS/83-839765-feedback-cartoon-png.jpg'
                alt='Empty!'
                className='w-40'
              />
            </div>
          </div>
          <div>
            <div className='pb-8'>
              <h1 className='text-2xl font-bold text-blue-600'>Selfless</h1>
              <p className='text-slate-400 pt-4'>
                BinaryCoders commits to octing with the best interests of our members at all times.
              </p>
            </div>
            <hr />
            <div className='pb-8 py-4'>
              <h1 className='text-2xl font-bold text-blue-600'>Communication</h1>
              <p className='text-slate-400 pt-4'>
                We are transparent and forthcoming with the good or bad news with our members.
              </p>
            </div>
            <hr />
            <div className='pb-8 pt-4'>
              <h1 className='text-2xl font-bold text-blue-600'>feedback</h1>
              <p className='text-slate-400 pt-4'>
                We work hard to ensure our members know about all of their option.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
