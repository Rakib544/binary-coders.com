import * as React from 'react'
// eslint-disable-next-line @typescript-eslint/no-empty-function
const useSSRLayoutEffect = typeof window === 'undefined' ? () => {} : React.useLayoutEffect

const BlurrableImage = ({
  img,
  blurDataURl,
  ...rest
}: {
  img: React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>
  blurDataURl?: string
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
    className: `${img.props.className} transition duration-300 h-40 w-40 absolute top-0 left-0 ${
      !visible ? 'opacity-0' : ''
    }`,
  })

  return (
    <div {...rest}>
      <img
        src={blurDataURl}
        className={`transition rounded-lg block object-cover object-center duration-300 absolute top-0 left-0 h-40 w-40 ${
          !visible ? '' : 'opacity-0'
        }`}
        alt={img.props.alt}
      />
      {jsImgEl}
      <noscript>{img}</noscript>
    </div>
  )
}

export default BlurrableImage
