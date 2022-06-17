import { useState } from 'react'

const Feature = () => {
  const [featureOpen, setFeatureOpen] = useState(false)
  const [featureOpenTwo, setFeatureOpenTwo] = useState(false)
  const [featureOpenThree, setFeatureOpenThree] = useState(false)
  const [featureOpenFour, setFeatureOpenFour] = useState(false)

  const handleFeature = () => {
    // setFeatureOpen(true);
    if (featureOpen) {
      setFeatureOpen(false)
    } else {
      setFeatureOpen(true)
    }
  }
  const handleFeatureTwo = () => {
    // setFeatureOpen(true);
    if (featureOpenTwo) {
      setFeatureOpenTwo(false)
    } else {
      setFeatureOpenTwo(true)
    }
  }
  const handleFeatureThree = () => {
    // setFeatureOpen(true);
    if (featureOpenThree) {
      setFeatureOpenThree(false)
    } else {
      setFeatureOpenThree(true)
    }
  }
  const handleFeatureFour = () => {
    // setFeatureOpen(true);
    if (featureOpenFour) {
      setFeatureOpenFour(false)
    } else {
      setFeatureOpenFour(true)
    }
  }
  return (
    <div>
      <div
        className='bg-blue-600 text-white py-4 px-2 border-0 rounded-lg cursor-pointer'
        onClick={handleFeature}
      >
        <div className='flex justify-between text-xl font-bold'>
          <p>Forums</p>
          <p>{featureOpen ? '-' : '+'}</p>
        </div>
        {featureOpen ? (
          <p className='py-4'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti ipsum excepturi
            similique, nemo sint maxime et qui quas pariatur inventore omnis voluptatibus ipsa iste
            nobis quod id enim aspernatur officiis.
          </p>
        ) : (
          ''
        )}
      </div>
      <div
        className='bg-blue-600 text-white py-4 px-2 border-0 rounded-lg cursor-pointer my-4'
        onClick={handleFeatureTwo}
      >
        <div className='flex justify-between text-xl font-bold'>
          <p>Question</p>
          <p>{featureOpenTwo ? '-' : '+'}</p>
        </div>
        {featureOpenTwo ? (
          <p className='py-4'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti ipsum excepturi
            similique, nemo sint maxime et qui quas pariatur inventore omnis voluptatibus ipsa iste
            nobis quod id enim aspernatur officiis.
          </p>
        ) : (
          ''
        )}
      </div>
      <div
        className='bg-blue-600 text-white py-4 px-2 border-0 rounded-lg cursor-pointer'
        onClick={handleFeatureThree}
      >
        <div className='flex justify-between text-xl font-bold'>
          <p>Solve Problems</p>
          <p>{featureOpenThree ? '-' : '+'}</p>
        </div>
        {featureOpenThree ? (
          <p className='py-4'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti ipsum excepturi
            similique, nemo sint maxime et qui quas pariatur inventore omnis voluptatibus ipsa iste
            nobis quod id enim aspernatur officiis.
          </p>
        ) : (
          ''
        )}
      </div>
      <div
        className='bg-blue-600 text-white py-4 px-2 border-0 rounded-lg cursor-pointer my-4'
        onClick={handleFeatureFour}
      >
        <div className='flex justify-between text-xl font-bold'>
          <p>Blog</p>
          <p>{featureOpenFour ? '-' : '+'}</p>
        </div>
        {featureOpenFour ? (
          <p className='py-4'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti ipsum excepturi
            similique, nemo sint maxime et qui quas pariatur inventore omnis voluptatibus ipsa iste
            nobis quod id enim aspernatur officiis.
          </p>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default Feature
