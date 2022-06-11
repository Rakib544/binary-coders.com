const Map = () => {
  return (
    <div className='mx-auto container-lg'>
      <div className='milestone-map'>
        <div className='milestone milestone-1' style={{ gridArea: 'a / a / a / a' }}>
          <span className='semester-pointer semester-1 shadow-lg'>1</span>
          <span className='dashed-line even'></span>
          <p>Introduction to Computer and Scratch Programming</p>
        </div>
        <div className='milestone milestone-2' style={{ gridArea: 'b / b / b / b' }}>
          {' '}
          <span className='semester-pointer semester-2 shadow-lg'>2</span>
          <span className='dashed-line even'></span>
          <p>Introduction to Programming Language</p>
        </div>
        <div className='milestone milestone-3' style={{ gridArea: 'c / c / c / c' }}>
          {' '}
          <span className='semester-pointer semester-1 shadow-lg'>3</span>
          <span className='dashed-line even'></span>
          <p>Basic Data Structures</p>
        </div>
        <div className='milestone milestone-4' style={{ gridArea: 'd / d / d / d' }}>
          {' '}
          <span className='semester-pointer semester-2 shadow-lg'>4</span>
          <span className='dashed-line even'></span>
          <p>Introduction to Algorithms</p>
        </div>
        <div className='milestone milestone-5' style={{ gridArea: 'e / e / e / e' }}>
          {' '}
          <span className='semester-pointer semester-1 shadow-lg'>5</span>
          <span className='dashed-line even'></span>
          <p>OOP and Python Programming</p>
        </div>
        <div className='milestone milestone-6' style={{ gridArea: 'f / f / f / f' }}>
          {' '}
          <span className='semester-pointer semester-2 shadow-lg'>6</span>
          <span className='dashed-line even'></span>
          <p>Database Management</p>
        </div>
        <div className='milestone milestone-7' style={{ gridArea: 'g / g / g / g' }}>
          {' '}
          <span className='semester-pointer semester-1 shadow-lg'>7</span>
          <span className='dashed-line even'></span>
          <p>Server, deploy, and Cloud computing</p>
        </div>
        <div className='milestone milestone-8' style={{ gridArea: 'h / h / h / h' }}>
          {' '}
          <span className='semester-pointer semester-2 shadow-lg'>8</span>
          <span className='dashed-line even'></span>
          <p>Introduction to Computer and Scratch Programming</p>
        </div>{' '}
        <div className='milestone milestone-9' style={{ gridArea: 'i / i / i / i' }}>
          {' '}
          <span className='semester-pointer semester-1 shadow-lg'>9</span>
          <span className='dashed-line even'></span>
          <p>Final Project</p>
        </div>{' '}
        <div className='milestone milestone-10' style={{ gridArea: 'j / j / j / j' }}>
          {' '}
          <span className='semester-pointer semester-2 shadow-lg'>
            10
            <img src='./images/achiveMentFlag.png' alt='' />
          </span>
          <span className='dashed-line even'></span>
          <p>Job/Intern Hunting</p>
        </div>
      </div>
    </div>
  )
}

export default Map
