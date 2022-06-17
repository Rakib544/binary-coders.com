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
