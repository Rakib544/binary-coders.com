import * as React from 'react'

const BlurrableImage = ({
  img,
  blurDataURl,
  ...rest
}: {
  img: React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>
  blurDataURl?: string
} & React.HtmlHTMLAttributes<HTMLDivElement>) => {
  const [visible, setVisible] = React.useState(false)
  const jsImgElRef = React.useRef<HTMLImageElement>()

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
  }, [])

  const jsImgEl = React.cloneElement(img, {
    // @ts-expect-error no idea
    ref: jsImgElRef,
    className: `${img.props.className} transition-opacity ${visible ? 'opacity-0' : ''}`,
  })

  return (
    <div {...rest}>
      {blurDataURl ? (
        <>
          <img src={blurDataURl} className={img.props.className} alt={img.props.alt} />
          <div className={`${img.props.className} backdrop-blur-xl`} />
        </>
      ) : null}
      {jsImgEl}
      <noscript>{img}</noscript>
    </div>
  )
}

export default BlurrableImage
