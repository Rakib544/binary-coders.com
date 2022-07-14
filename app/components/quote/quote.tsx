const Quote = () => {
  return (
    <div className='px-4 md:px-12 my-24'>
      <div className='grid grid-cols-2 items-center'>
        <div className='col-span-2 md:col-span-1 order-2 md:order-1'>
          <img src='/images/Programmer.webp' loading='lazy' alt='programingQuoteImg' />
        </div>
        <div className='col-span-2 md:col-span-1 order-2 md:order-1 md:p-12 p-3'>
          <h1 className='text-4xl font-bold mb-4 text-slate-700'>
            &quot;Programming isn&apos;t about what you know; it&apos;s about what you can figure
            out.&quot;
          </h1>
          <strong className='text-slate-500'> - Chris Pine</strong>
          <p className='mt-8 text-slate-500'>
            Especially important for beginners. At first, we&apos;re so anxious about knowing
            everything, especially language syntax. Problem-solving is the skill we end up using
            most.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Quote
