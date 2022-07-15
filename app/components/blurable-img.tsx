import * as React from 'react'
// eslint-disable-next-line @typescript-eslint/no-empty-function
const useSSRLayoutEffect = typeof window === 'undefined' ? () => {} : React.useLayoutEffect

const BlurrableImage = ({
  img,
  blurDataURl,
  roundedFull = false,
  ...rest
}: {
  img: React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>
  blurDataURl?: string
  roundedFull?: boolean
} & React.HtmlHTMLAttributes<HTMLDivElement>) => {
  const [visible, setVisible] = React.useState(false)
  const jsImgElRef = React.useRef<HTMLImageElement>(null)

  useSSRLayoutEffect(() => {
    if (jsImgElRef.current?.complete) setVisible(true)
  }, [])

  React.useEffect(() => {
    if (!jsImgElRef.current) return
    if (jsImgElRef.current.complete) return
    let current = true
    jsImgElRef.current.addEventListener('load', () => {
      if (!jsImgElRef.current || !current) return
      setTimeout(() => {
        setVisible(true)
      }, 0)
    })

    return () => {
      current = false
    }
  }, [jsImgElRef])

  const jsImgEl = React.cloneElement(img, {
    // @ts-expect-error no idea
    ref: jsImgElRef,
    className: `${img.props.className} transition duration-200 absolute top-0 left-0 ${
      !visible ? 'opacity-0' : ''
    }`,
  })

  return (
    <div {...rest}>
      <img
        src={blurDataURl}
        className={`${
          img.props.className
        } transition  block w-full object-cover object-center duration-200 absolute top-0 left-0 ${
          !visible ? '' : 'opacity-0'
        }  ${roundedFull ? 'rounded-full' : 'rounded-lg'}`}
        alt={img.props.alt}
      />
      {jsImgEl}
      <noscript>{img}</noscript>
    </div>
  )
}

export default BlurrableImage
