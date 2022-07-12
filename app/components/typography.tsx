import * as React from 'react'

type TitleProps = {
  variant?: 'primary' | 'secondary'
  as?: React.ElementType
  className?: string
  id?: string
} & { children: React.ReactNode }

const fontSize = {
  h1: 'leading-tight text-4xl md:text-5xl font-bold',
  h2: 'leading-tight text-3xl md:text-4xl',
  h3: 'text-2xl font-medium md:text-3xl',
  h4: 'text-lg font-medium md:text-2xl',
  h5: 'text-lg font-medium md:text-2xl',
  h6: 'text-lg font-medium',
}

const titleColors = {
  primary: 'text-slate-700',
  secondary: 'text-slate-700',
}

function Title({
  variant = 'primary',
  size,
  as,
  className,
  ...rest
}: TitleProps & { size: keyof typeof fontSize }) {
  const Tag = as ?? size

  return <Tag className={`${fontSize[size]} ${titleColors[variant]} ${className}`} {...rest} />
}

function H1(props: TitleProps) {
  return <Title {...props} size='h1' />
}

function H2(props: TitleProps) {
  return <Title {...props} size='h2' />
}

function H3(props: TitleProps) {
  return <Title {...props} size='h3' />
}

function H4(props: TitleProps) {
  return <Title {...props} size='h4' />
}

function H5(props: TitleProps) {
  return <Title {...props} size='h5' />
}

function H6(props: TitleProps) {
  return <Title {...props} size='h6' />
}

type ParagraphProps = {
  className?: string
  textColorClassName?: string
  as?: React.ElementType
} & { children: React.ReactNode }

function Paragraph({
  className,
  as = 'p',
  textColorClassName = 'text-slate-500',
  ...rest
}: ParagraphProps) {
  return React.createElement(as, {
    className: `max-w-full text-lg ${textColorClassName} ${className}`,
    ...rest,
  })
}

function Heading({
  children,
  as = 'h2',
  className,
}: {
  children: React.ReactNode | React.ReactNode[]
  as?: React.ElementType
  className?: string
}) {
  const Tag = as
  return (
    <Tag
      className={`text-center text-4xl font-bold bg-clip-text py-2 text-transparent bg-gradient-to-b from-cyan-400 to-blue-600 ${className}`}
    >
      {children}
    </Tag>
  )
}

export { H1, H2, H3, H4, H5, H6, Paragraph, Heading }
